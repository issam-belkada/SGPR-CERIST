<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkPackage;
use App\Models\Projet;
use Illuminate\Http\Request;

class WorkPackageController extends Controller
{
    // Lister les WP d'un projet avec leurs tâches
    public function index(Projet $projet)
    {
        return response()->json($projet->workPackages()->with('taches.responsable')->get());
    }

    // Créer un WP (Chef de projet uniquement)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'projet_id' => 'required|exists:projets,id',
            'code_wp' => 'required|string',
            'titre' => 'required|string|max:255',
            'objectifs' => 'required|string', // Bien inclus ici
        ]);

        $wp = WorkPackage::create($validated);

        return response()->json([
            'message' => 'Work Package créé avec succès',
            'wp' => $wp
        ], 201);
    }

    public function destroy(WorkPackage $workPackage)
    {
        if (auth()->id() !== $workPackage->projet->chef_projet_id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }
        $workPackage->delete();
        return response()->json(['message' => 'WP supprimé']);
    }
}
