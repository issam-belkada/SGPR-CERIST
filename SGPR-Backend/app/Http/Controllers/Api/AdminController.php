<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    /** Liste tous les utilisateurs avec leur division et rôles */
    public function indexUsers()
    {
        return response()->json(User::with(['division', 'roles'])->orderBy('nom')->get());
    }

    /** Créer un nouvel utilisateur */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            // Validation stricte pour correspondre à l'ENUM PostgreSQL
            'grade' => ['required', Rule::in(['PR', 'MCA', 'MCB', 'MAA', 'MAB', 'DR', 'MRA', 'MRB', 'CR', 'AR', 'Ingénieur', 'TS'])],
            'specialite' => 'required|string|max:255',
            'role' => 'required|string',
            'division_id' => 'nullable|exists:divisions,id',
        ]);

        $user = User::create([
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'grade' => $validated['grade'],
            'specialite' => $validated['specialite'],
            'division_id' => $validated['division_id'],
        ]);

        if ($request->has('role')) {
            $user->assignRole($request->role);
        }

        return response()->json([
            'message' => 'Utilisateur créé avec succès', 
            'user' => $user->load('roles')
        ], 201);
    }

    /** Afficher un utilisateur spécifique */
    public function showUser(User $user)
    {
        return response()->json($user->load(['division', 'roles']));
    }

    /** Modifier un utilisateur */
    public function updateUser(Request $request, User $user)
{
    $validated = $request->validate([
        'nom' => 'sometimes|string|max:255',
        'prenom' => 'sometimes|string|max:255',
        'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
        'password' => 'nullable|min:8',
        'grade' => ['sometimes', Rule::in(['PR', 'MCA', 'MCB', 'MAA', 'MAB', 'DR', 'MRA', 'MRB', 'CR', 'AR', 'Ingénieur', 'TS'])],
        'specialite' => 'sometimes|string|max:255',
        'role' => 'sometimes|string',
        'division_id' => 'nullable|exists:divisions,id',
    ]);

    // Gestion du mot de passe
    if ($request->filled('password')) {
        $validated['password'] = Hash::make($request->password);
    } else {
        unset($validated['password']);
    }

    $userData = collect($validated)->except('role')->toArray();
    $user->update($userData);


    if ($request->has('role')) {

        $user->syncRoles([$request->role]);
    }

    return response()->json([
        'message' => 'Utilisateur mis à jour avec succès',
        'user' => $user->load('roles')
    ]);
}

    /** Supprimer un utilisateur */
    public function destroyUser(User $user)
    {
        if (auth()->id() === $user->id) {
            return response()->json(['error' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    /** --- GESTION DES DIVISIONS --- **/

    public function indexDivisions()
    {
        return response()->json(Division::withCount('users')->get());
    }

    public function storeDivision(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|unique:divisions,nom',
            'acronyme' => 'required|string|unique:divisions,acronyme',
            'description' => 'nullable|string'
        ]);

        $division = Division::create($validated);
        return response()->json($division, 201);
    }

    public function showDivision(Division $division)
    {
        return response()->json($division->load('users.roles'));
    }

    public function updateDivision(Request $request, Division $division)
    {
        $validated = $request->validate([
            'nom' => ['sometimes', 'string', Rule::unique('divisions')->ignore($division->id)],
            'acronyme' => ['sometimes', 'string', Rule::unique('divisions')->ignore($division->id)],
            'description' => 'nullable|string'
        ]);

        $division->update($validated);
        return response()->json($division);
    }

    public function destroyDivision(Division $division)
    {
        if ($division->users()->count() > 0) {
            return response()->json([
                'error' => 'Cette division contient encore des chercheurs.'
            ], 422);
        }

        $division->delete();
        return response()->json(['message' => 'Division supprimée avec succès']);
    }



    public function assignChef(Request $request, Division $division)
{
    $request->validate(['chef_id' => 'required|exists:users,id']);

    // 1. Mettre à jour le chef dans la table divisions
    $division->chef_id = $request->chef_id;
    $division->save();

    // 2. Mettre à jour le rôle Spatie de l'utilisateur
    $user = User::find($request->chef_id);
    $user->syncRoles(['ChefDivision']);

    return response()->json(['message' => 'Chef assigné avec succès']);
}





    /** Statistiques du Dashboard */
    public function getStatistics()
    {
        try {
            return response()->json([
                'totalUsers' => User::count(),
                'totalDivisions' => Division::count(),
                'adminsCount' => User::role('Admin')->count(), 
                'recentUsers' => User::orderBy('created_at', 'desc')
                                    ->take(5)
                                    ->get(['nom', 'prenom', 'grade']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}