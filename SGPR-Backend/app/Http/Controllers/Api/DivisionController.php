<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Division;

class DivisionController extends Controller
{
    // DivisionController.php

// DivisionController.php

public function getDivisionMembres()
{
    $user = auth()->user();

    // Vérification Spatie : l'utilisateur a-t-il le rôle ?
    if (!$user->hasRole('ChefDivision')) {
        return response()->json(['message' => 'Accès refusé : vous n\'êtes pas chef.'], 403);
    }

    // On récupère la division associée au division_id de l'utilisateur connecté
    $division = Division::with(['users' => function($query) use ($user) {
        // Optionnel : exclure le chef lui-même de la liste des membres
        $query->where('id', '!=', $user->id); 
    }])
    ->where('id', $user->division_id) // On utilise le lien direct
    ->first();

    if (!$division) {
        return response()->json(['message' => 'Division introuvable pour cet utilisateur.'], 404);
    }

    return response()->json([
        'division' => $division,
        'membres' => $division->users
    ]);
}
}
