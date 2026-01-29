<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Livrable;
use App\Models\Projet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Tache;
use Illuminate\Support\Str;

class LivrableController extends Controller
{
    public function index(Projet $projet)
    {
        return response()->json($projet->livrables()->with(['tache', 'depositaire'])->get());
    }

    public function store(Request $request, Projet $projet)
    {
        // Seul un membre du projet peut déposer un livrable
        if (!$projet->membres()->where('user_id', auth()->id())->exists()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'tache_id' => 'nullable|exists:taches,id',
            'titre' => 'required|string|max:255',
            'type' => 'required|in:Rapport_Technique,Manuel_Utilisateur,Code_Source,Synthese_Biblio,Expertise',
            'fichier' => 'required|file|mimes:pdf,zip,rar,doc,docx|max:20480',
        ]);

        if ($request->hasFile('fichier')) {
            $path = $request->file('fichier')->store('livrables/projet_' . $projet->id);
            
            $livrable = Livrable::create([
                'projet_id' => $projet->id,
                'tache_id' => $validated['tache_id'] ?? null,
                'titre' => $validated['titre'],
                'type' => $validated['type'],
                'fichier_path' => $path,
                'date_depot' => now(),
                'depose_par' => auth()->id()
            ]);

            return response()->json($livrable, 201);
        }
    }


    public function storeFromTache(Request $request) 
{
    // 1. Validation des données
    $request->validate([
        'tache_id' => 'required|exists:taches,id',
        'titre' => 'required|string|max:255',
        'type' => 'required|in:Rapport_Technique,Manuel_Utilisateur,Code_Source,Synthese_Biblio,Expertise,Logiciel_Code,Prototype,Publication,Brevet,Autre',
        'fichier' => 'required|file|max:20480', // Max 20Mo
    ]);

    // 2. Récupération de la tâche et du projet lié
    $tache = Tache::with('workPackage')->findOrFail($request->tache_id);
    $projetId = $tache->workPackage->projet_id;

    // 3. Stockage du fichier
    if ($request->hasFile('fichier')) {
        $path = $request->file('fichier')->store('livrables/projet_' . $projetId);

        // 4. Création de l'enregistrement
        $livrable = Livrable::create([
            'projet_id'   => $projetId,
            'tache_id'    => $tache->id,
            'titre'       => $request->titre,
            'type'        => $request->type,
            'fichier_path'=> $path,
            'date_depot'  => now(),
            'depose_par'  => auth()->id()
        ]);

        return response()->json($livrable, 201);
    }

    return response()->json(['message' => 'Fichier manquant'], 400);
}




    public function updateMissingLivrable(Request $request, $id)
{
    $request->validate([
        'fichier' => 'required|file|max:20480', 
    ]);

    $livrable = Livrable::findOrFail($id);

    // Récupération du projetId via le livrable ou la hiérarchie des tâches
    $projetId = $livrable->projet_id;

    if (!$projetId && $livrable->tache) {
        $projetId = $livrable->tache->workPackage->projet_id;
    }

    if (!$projetId) {
        return response()->json(['message' => 'Impossible d\'identifier le projet associé.'], 422);
    }

    if ($request->hasFile('fichier')) {
        // CHANGEMENT ICI : On retire ', "public"' pour utiliser le stockage par défaut
        $path = $request->file('fichier')->store('livrables/projet_' . $projetId);

        $livrable->update([
            'fichier_path' => $path,
            'date_depot' => now(),
            'depose_par' => auth()->id(),
            'projet_id' => $projetId 
        ]);

        return response()->json($livrable, 200);
    }
}





public function destroy(Livrable $livrable)
{
    $user = auth()->user();
    $projet = $livrable->projet;

    // Vérification des droits
    $isOwner = $livrable->depose_par === $user->id;
    $isChefProjet = $projet->chef_projet_id === $user->id;

    if (!$isOwner && !$isChefProjet) {
        return response()->json([
            'message' => 'Action non autorisée. Seul l\'auteur ou le chef de projet peut supprimer ce fichier.'
        ], 403);
    }

    // Suppression physique du fichier
    if (Storage::exists($livrable->fichier_path)) {
        Storage::delete($livrable->fichier_path);
    }

    $livrable->delete();

    return response()->json(['message' => 'Livrable supprimé avec succès']);
}



public function download(Livrable $livrable)
{
    // On utilise Storage:: sans spécifier de disque (utilise le disque par défaut 'local')
    if (!Storage::exists($livrable->fichier_path)) {
        return response()->json([
            'error' => 'Fichier introuvable sur le serveur',
            'path' => $livrable->fichier_path 
        ], 404);
    }

    $extension = pathinfo($livrable->fichier_path, PATHINFO_EXTENSION);
    $fileName = Str::slug($livrable->titre) . '.' . $extension;

    // Téléchargement depuis le disque par défaut
    return Storage::download($livrable->fichier_path, $fileName);
}
}