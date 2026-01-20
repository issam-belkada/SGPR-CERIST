<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Division;
use App\Models\Projet;
use App\Models\Tache;


class ChercheurController extends Controller
{
        public function getMesProjets(Request $request)
{
    $userId = $request->user()->id;

    // Utilisation de query builder avec des jointures explicites pour débogage facile
    $projets = Projet::query()
        ->where(function ($query) use ($userId) {
            // Cas 1 : Ryad est le chef
            $query->where('chef_projet_id', $userId)
            // Cas 2 : Ryad est dans la table participation
            ->orWhereHas('membres', function ($q) use ($userId) {
                $q->where('participation.user_id', $userId);
            });
        })
        ->with(['division', 'chefProjet'])
        ->withCount('membres')
        ->orderBy('created_at', 'desc')
        ->get();

    // Mapping pour le frontend
    return response()->json($projets->map(function ($p) {
        return [
            'id' => $p->id,
            'titre' => $p->titre,
            'acronyme' => $p->titre, // Assurez-vous d'avoir une colonne acronyme ou utilisez le titre
            'nature' => $p->nature,
            'statut' => $p->statut,
            'date_debut' => $p->date_debut ? $p->date_debut->format('Y-m-d') : null,
            'chef_projet_id' => $p->chef_projet_id,
            'membres_count' => $p->membres_count,
            'progression' => $p->dernier_avancement, // Déclenché par votre accessor
            'division_nom' => $p->division->nom ?? 'N/A'
        ];
    }));
}





    public function getProjetDetails($id, Request $request)
{
    $user = $request->user();

    // On charge toute la hiérarchie définie dans vos modèles
    $projet = Projet::with([
        'division',
        'chefProjet',
        'membres',
        'workPackages.taches.responsable', // Charge le User responsable
        'workPackages.taches.livrables'    // Charge les livrables de chaque tâche
    ])->findOrFail($id);

    $projetArray = $projet->toArray();
    $projetArray['auth_user_id'] = $user->id;

    // On extrait tous les livrables pour l'onglet "Mes Livrables"
    // On utilise collect() pour aplatir la hiérarchie WP -> Taches -> Livrables
    $allLivrables = collect();
    foreach ($projet->workPackages as $wp) {
        foreach ($wp->taches as $tache) {
            foreach ($tache->livrables as $livrable) {
                $allLivrables->push($livrable);
            }
        }
    }
    
    $projetArray['all_livrables'] = $allLivrables;

    return response()->json($projetArray);
}

    public function getMaDivision(Request $request) 
{
    $user = $request->user();

    if (!$user->division_id) {
        return response()->json(['message' => 'Aucune division associée à votre compte.'], 404);
    }

    // Changement de 'membres' vers 'users' (le nom dans votre modèle)
    $division = Division::with(['users' => function($query) {
                    $query->orderBy('nom', 'asc');
                }, 'chef'])
                ->where('id', $user->division_id) 
                ->first();

    if (!$division) {
        return response()->json(['message' => 'Division introuvable'], 404);
    }

    return response()->json($division);
}






      public function getChercheurStats(Request $request)
{
    $user = $request->user();

    // 1. Compter les projets (Chef OU Participant)
    $projetsCount = \App\Models\Projet::where('chef_projet_id', $user->id)
        ->orWhereHas('membres', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();

    // 2. Compter ses tâches personnelles (toutes celles dont il est responsable)
    $tachesCount = \App\Models\Tache::where('responsable_id', $user->id)->count();

    // 3. Compter les tâches terminées pour calculer un ratio
    $tachesTerminees = \App\Models\Tache::where('responsable_id', $user->id)
        ->where('etat', 'Terminé')
        ->count();

    // 4. Récupérer les 3 prochaines échéances (tâches non finies)
    $prochainesEcheances = \App\Models\Tache::where('responsable_id', $user->id)
        ->where('etat', '!=', 'Terminé')
        ->with('workPackage.projet')
        ->orderBy('updated_at', 'asc')
        ->take(3)
        ->get();

    return response()->json([
        'projets_count' => $projetsCount,
        'taches_count' => $tachesCount,
        'taches_terminees' => $tachesTerminees,
        'ratio_completion' => $tachesCount > 0 ? round(($tachesTerminees / $tachesCount) * 100) : 0,
        'echeances' => $prochainesEcheances
    ]);
}

}
