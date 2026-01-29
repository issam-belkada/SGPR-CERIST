<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tache;
use App\Models\WorkPackage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class TacheController extends Controller
{
    // Créer une tâche dans un WP
    public function store(Request $request)
    {
        $validated = $request->validate([
            'work_package_id' => 'required|exists:work_packages,id',
            'nom' => 'required|string|max:255',
            'responsable_id' => 'required|exists:users,id',
            'description' => 'required|max:255',
            'livrables' => 'present|array', // Reçu de la modale React
            'livrables.*.titre' => 'required|string',
            'livrables.*.type' => 'required|string',
        ]);

        try {
            $result = DB::transaction(function () use ($validated) {
                // 1. Trouver le projet_id via le WP pour lier le livrable au projet
                $wp = WorkPackage::findOrFail($validated['work_package_id']);

                // 2. Créer la tâche
                $tache = Tache::create([
                    'work_package_id' => $validated['work_package_id'],
                    'nom' => $validated['nom'],
                    'responsable_id' => $validated['responsable_id'],
                    'description' => $validated['description'],
                    'etat' => 'A faire',
                ]);

                // 3. Créer les livrables "placeholders" (en attente de fichier)
                foreach ($validated['livrables'] as $livData) {
                    $tache->livrables()->create([
                        'projet_id' => $wp->projet_id,
                        'titre' => $livData['titre'],
                        'type' => $livData['type'],
                        'fichier_path' => 'waiting_upload', // Marqueur essentiel pour votre logique Front-end
                    ]);
                }

                return $tache->load('livrables');
            });

            return response()->json($result, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function show($id)
{
    // Suppression du 'l' inutile qui causait l'erreur 500
    $tache = Tache::with([
        'workPackage.projet', 
        'livrables.depositaire', 
        'responsable'
    ])->find($id);

    if (!$tache) {
        return response()->json(['message' => 'Tâche non trouvée'], 404);
    }

    return response()->json($tache);
}

    // Mettre à jour l'état ou les infos d'une tâche
    public function update(Request $request, Tache $tache)
{
    $user = auth()->user();
    // On vérifie si l'utilisateur est responsable de la tâche ou chef de projet
    if ($user->id !== $tache->responsable_id && $user->id !== $tache->workPackage->projet->chef_projet_id) {
        return response()->json(['error' => 'Non autorisé'], 403);
    }

    $validated = $request->validate([
        'etat' => 'required|in:En attente,En cours,Terminé,A faire',
        'livrable_titre' => 'nullable|string|max:255'
    ]);

    $tache->update(['etat' => $request->etat]);

    // Si un titre de livrable est fourni, on le crée
    if ($request->filled('livrable_titre')) {
        $tache->livrables()->create([
            'titre' => $request->livrable_titre,
            'projet_id' => $tache->workPackage->projet_id,
            'chercheur_id' => $user->id,
            'date_depot' => now(),
            'type' => 'Document de travail',
            'chemin_fichier' => 'draft'
        ]);
    }

    return response()->json($tache->load('livrables'));
}

    public function mesTaches()
    {
        $userId = auth()->id();
        
        if (!$userId) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        return Tache::where('responsable_id', $userId)
            ->with(['workPackage.projet'])
            ->orderBy('updated_at', 'asc')
            ->get();
    }



    public function updateStatus(Request $request, $id)
{
    $tache = Tache::findOrFail($id);
    $user = auth()->user();

    // DEBUG : Vérifiez vos logs si ça bloque encore
    // \Log::info("User ID: " . $user->id . " | Responsable ID: " . $tache->responsable_id);

    // 1. Vérification Responsable (Utilisez == pour éviter les soucis de type)
    if ($user->id != $tache->responsable_id) {
        return response()->json(['message' => 'Action interdite : Vous n\'êtes pas le responsable.'], 403);
    }

    // 2. Vérification Projet en cours
    if ($tache->workPackage->projet->statut !== 'enCours') {
        return response()->json(['message' => 'Le projet doit être "en cours".'], 422);
    }

    $validated = $request->validate([
        'etat' => 'required|in:A faire,En cours,Terminé',
    ]);

    $tache->update(['etat' => $request->etat]);

    return response()->json($tache);
}







}
