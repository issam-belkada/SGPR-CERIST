<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tache;
use App\Models\WorkPackage;
use Illuminate\Http\Request;

class TacheController extends Controller
{
    // Créer une tâche dans un WP
    public function store(Request $request, WorkPackage $workPackage)
    {
        // Vérifier si l'utilisateur est le chef du projet lié au WP
        if (auth()->id() !== $workPackage->projet->chef_projet_id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'responsable_id' => 'required|exists:users,id',
            'etat' => 'required|in:A faire,En cours,Terminé',
        ]);

        $tache = $workPackage->taches()->create($validated);
        return response()->json($tache, 201);
    }


    public function show($id)
    {
        // On récupère la tâche avec le WP, le projet et les livrables déjà déposés
        $tache = Tache::with(['workPackage.projet', 'livrables.depositaire','responsable','livrables'])
                      ->find($id);

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
    // Récupère les tâches assignées à l'utilisateur avec les infos du projet
    return Tache::where('responsable_id', auth()->id())
        ->with(['workPackage.projet'])
        ->orderBy('date_fin', 'asc')
        ->get();
}
}
