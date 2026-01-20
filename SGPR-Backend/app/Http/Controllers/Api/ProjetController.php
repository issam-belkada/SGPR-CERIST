<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Projet;
use App\Models\Livrable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ProjetController extends Controller
{
    /**
     * Liste des projets filtrée selon les permissions de l'utilisateur.
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole(['Admin', 'ChefCS'])) {
            $projets = Projet::with(['chefProjet', 'division'])->get();
        } elseif ($user->hasRole('ChefDivision')) {
            $projets = Projet::where('division_id', $user->division_id)
                ->with(['chefProjet'])
                ->get();
        } else {
            $projets = Projet::where('chef_projet_id', $user->id)
                ->orWhereHas('membres', function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->with(['division', 'chefProjet'])
                ->get();
        }

        return response()->json($projets);
    }

    public function myProjects(Request $request)
    {
        return $request->user()->projets()->withCount('membres')->get();
    }

    public function searchUsers(Request $request)
    {
        $q = strtolower($request->query('q'));

        return User::role('Chercheur')
            ->with('division:id,nom')
            ->where(function ($query) use ($q) {
                $query->whereRaw('LOWER(nom) LIKE ?', ["%{$q}%"])
                      ->orWhereRaw('LOWER(prenom) LIKE ?', ["%{$q}%"]);
            })
            ->limit(10)
            ->get(['id', 'nom', 'prenom', 'grade', 'division_id']);
    }

    /**
     * Soumission d'une nouvelle proposition.
     * Adaptée pour respecter strictement les contraintes SQL (NOT NULL et ENUM).
     */
    public function store(Request $request)
{
    $user = Auth::user();

    if (!$user) {
        return response()->json(['message' => 'Non authentifié'], 401);
    }

    try {
        return DB::transaction(function () use ($request, $user) {
            // 1. Création du projet
            $projet = Projet::create([
                'titre'         => $request->titre,
                'nature'        => $request->nature,
                'type'          => $request->type,
                'resume'        => $request->resume,
                'problematique' => $request->problematique,
                'objectifs'     => $request->objectifs,
                'duree_mois'    => (int)$request->duree_mois,
                'chef_projet_id'=> $user->id,
                'division_id'   => $user->division_id,
                'statut'        => 'Proposé',
            ]);

            // 2. Membres
            if ($request->has('membres')) {
                foreach ($request->membres as $membre) {
                    $projet->membres()->attach($membre['user_id'], [
                        'pourcentage_participation' => $membre['pourcentage'] ?? 0,
                        'qualite' => $membre['qualite'] ?? 'permanent'
                    ]);
                }
            }

            // 3. WPs / Tâches / Livrables
            if ($request->has('wps')) {
                foreach ($request->wps as $wpData) {
                    $wp = $projet->workPackages()->create([
                        'code_wp'   => $wpData['code_wp'],
                        'titre'     => $wpData['titre'],
                        'objectifs' => $wpData['objectifs'] ?? '',
                    ]);

                    if (isset($wpData['taches'])) {
                        foreach ($wpData['taches'] as $tacheData) {
                            $tache = $wp->taches()->create([
                                'nom'            => $tacheData['nom'],
                                'responsable_id' => $tacheData['responsable_id'] ?: $user->id,
                                'date_debut'     => now(), 
                                'date_fin'       => now()->addMonths(1),
                                'etat'           => 'A faire'
                            ]);

                            // On vérifie si la tâche possède des livrables
                            if (!empty($tacheData['livrables'])) {
                                foreach ($tacheData['livrables'] as $livData) {
                                    Livrable::create([
                                        'projet_id'    => $projet->id,
                                        'tache_id'     => $tache->id,
                                        'titre'        => $livData['titre'],
                                        'type'         => $livData['type'], // Validé par le CHECK Postgres
                                        'fichier_path' => 'waiting_upload', 
                                        'date_depot'   => now(),
                                        'depose_par'   => $user->id
                                    ]);
                                }
                            }
                        }
                    }
                }
            }

            return response()->json([
                'message' => 'Votre proposition de projet a été soumise avec succès.',
                'id' => $projet->id
            ], 201);
        });
    } catch (\Exception $e) {
        // En cas d'erreur (ex: type non autorisé par Postgres), la transaction s'annule
        return response()->json([
            'message' => 'Erreur lors de la création du projet',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Étape 2 : Approbation finale par le Conseil Scientifique.
     */
    public function approuverParCS(Projet $projet)
    {
        if ($projet->statut !== 'Valide_Division') {
            return response()->json(['error' => 'Le projet doit d\'abord être validé par la division.'], 400);
        }

        $projet->update(['statut' => 'Nouveau']);
        return response()->json(['message' => 'Projet approuvé par le CS.']);
    }

    /**
     * Étape 3 : Lancement du projet.
     */
    public function lancerProjet(Projet $projet)
    {
        $user = Auth::user();

        if ($projet->chef_projet_id !== $user->id) {
            return response()->json(['error' => 'Seul le porteur du projet peut le lancer.'], 403);
        }

        if ($projet->statut !== 'Nouveau') {
            return response()->json(['error' => 'Le projet n\'est pas encore approuvé.'], 400);
        }

        $dateDebut = now();
        $dateFin = $dateDebut->copy()->addMonths($projet->duree_mois);

        $projet->update([
            'statut' => 'enCours',
            'date_debut' => $dateDebut,
            'date_fin' => $dateFin
        ]);

        if (!$user->hasRole('ChefProjet')) {
            $user->assignRole('ChefProjet');
        }

        return response()->json(['message' => 'Le projet est maintenant officiellement en cours.']);
    }

    public function ajouterMembre(Request $request, Projet $projet)
{
    if (auth()->id() !== $projet->chef_projet_id && !auth()->user()->hasRole('Admin')) {
        return response()->json(['error' => 'Non autorisé.'], 403);
    }

    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        // On rend ces champs optionnels ici pour la modale simplifiée
        'pourcentage_participation' => 'nullable|integer|min:1|max:100',
        'qualite' => 'nullable|in:permanent,associe',
    ]);

    if ($projet->membres()->where('user_id', $validated['user_id'])->exists()) {
        return response()->json(['error' => 'Déjà membre.'], 422);
    }

    $projet->membres()->attach($validated['user_id'], [
        'pourcentage_participation' => $validated['pourcentage_participation'] ?? 20, // 20% par défaut
        'qualite' => $validated['qualite'] ?? 'permanent'
    ]);

    return response()->json(['message' => 'Membre ajouté avec succès.']);
}

    public function retirerMembre(Projet $projet, $userId)
    {
        if (auth()->id() !== $projet->chef_projet_id && !auth()->user()->hasRole('Admin')) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        if ((int)$userId === $projet->chef_projet_id) {
            return response()->json(['error' => 'Impossible de retirer le chef.'], 422);
        }

        $projet->membres()->detach($userId);

        return response()->json(['message' => 'Membre retiré.']);
    }
}