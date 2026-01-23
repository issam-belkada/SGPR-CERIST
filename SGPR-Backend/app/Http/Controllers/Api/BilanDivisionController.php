<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BilanDivision;
use App\Models\BilanAnnuel;
use App\Models\Division;
use App\Models\User;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class BilanDivisionController extends Controller
{
    /**
     * Préparer/Générer le bilan de division (Mode Brouillon)
     */
    public function getBilansValides(Request $request)
{
    try {
        $divisionId = $request->user()->division_id;
        $annee = date('Y');

        // Récupération massive de toutes les données liées aux projets de la division
        $bilansProjets = BilanAnnuel::with([
                // Section 1 & 2 : Projet et structure
                'projet.division', 
                'projet.chefProjet',
                
                // Section 2 : Membres et leur implication
                'projet.membres' => function($query) {
                    $query->withPivot('pourcentage_participation', 'qualite');
                },

                // Section 4.1 : Production Scientifique (Articles, Conférences)
                'productionsScientifiques',

                // Section 4.2 : Production Technologique (Logiciels, Brevets)
                'productionsTechnologiques',

                // Section 4.3 : Formation (Thèses, Masters)
                'encadrements'
            ])
            ->whereHas('projet', function($q) use ($divisionId) {
                $q->where('division_id', $divisionId);
            })
            ->where('annee', $annee)
            ->where('etat_validation', 'Valide')
            ->get();

        // Calcul des statistiques du personnel (votre logique précédente)
        $statsPersonnel = \App\Models\User::where('division_id', $divisionId)
            ->select('grade', \DB::raw('count(*) as total'))
            ->groupBy('grade')
            ->pluck('total', 'grade');

        return response()->json([
            'bilans_projets' => $bilansProjets,
            'stats_automatiques' => $statsPersonnel,
            'division_nom' => $request->user()->division->nom ?? 'Ma Division',
            'annee' => $annee
        ], 200);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Erreur', 'error' => $e->getMessage()], 500);
    }
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'annee' => 'required|integer',
            'statistiques_personnel' => 'required|array',
            'formation_qualifiante' => 'nullable|string',
            'sejours_etranger' => 'nullable|string',
            'animation_scientifique' => 'nullable|string',
            'cooperation_partenariat' => 'nullable|string',
            'bilans_projets_ids' => 'required|array' // Les IDs des bilans de projets à lier
        ]);

        try {
            DB::beginTransaction();

            $bilan = BilanDivision::create([
                'division_id' => $request->user()->division_id,
                'chef_division_id' => $request->user()->id,
                'annee' => $validated['annee'],
                'statistiques_personnel' => $validated['statistiques_personnel'],
                'formation_qualifiante' => $validated['formation_qualifiante'],
                'sejours_etranger' => $validated['sejours_etranger'],
                'animation_scientifique' => $validated['animation_scientifique'],
                'cooperation_partenariat' => $validated['cooperation_partenariat'],
                'etat' => 'Brouillon'
            ]);

            // Lier les bilans de projets via la table pivot bilan_division_items
            $bilan->bilansProjets()->attach($validated['bilans_projets_ids']);

            DB::commit();
            return response()->json(['message' => 'Bilan de division créé avec succès', 'id' => $bilan->id], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Transmettre le bilan consolidé au Conseil Scientifique (CS)
     */
    public function index()
{
    $user = Auth::user();

    // On récupère les bilans de la division de l'utilisateur avec ses relations
    $bilans = BilanDivision::where('division_id', $user->division_id)
        ->with([
            'division:id,nom,acronyme', // Charge le nom et l'acronyme de la division
            'chefDivision:id,nom,prenom' // Charge l'identité du créateur
        ])
        ->withCount('bilansProjets') // Ajoute automatiquement un attribut 'bilans_projets_count'
        ->orderBy('annee', 'desc')
        ->get();

    // On peut aussi ajouter un petit calcul côté PHP si nécessaire avant de renvoyer
    $bilans->map(function ($bilan) {
        // Optionnel : Calculer le total des effectifs directement ici pour le frontend
        $bilan->total_personnel = collect($bilan->statistiques_personnel)->sum();
        return $bilan;
    });

    return response()->json($bilans, 200);
}

    // DivisionBilanController.php

     public function showComplet($id)
{
    try {
        // 1. Charger le bilan de division avec ses relations de base
        $bilanDivision = BilanDivision::with(['division', 'chefDivision'])->findOrFail($id);

        // 2. Charger les bilans de projets via la relation Many-to-Many définie dans votre modèle
        // On récupère TOUT ce qui est nécessaire pour l'affichage consolidé
        $bilansDetailleProjets = $bilanDivision->bilansProjets()->with([
            'projet.division', 
            'projet.chefProjet',
            'projet.membres' => function($query) {
                $query->withPivot('pourcentage_participation', 'qualite');
            },
            'productionsScientifiques',
            'productionsTechnologiques',
            'encadrements'
        ])->get();

        return response()->json([
            'bilan_division' => $bilanDivision,
            'bilans_projets_details' => $bilansDetailleProjets
        ], 200);

    } catch (\Exception $e) {
        return response()->json(['message' => 'Erreur de consolidation', 'error' => $e->getMessage()], 500);
    }
}   



    /**
     * Change l'état du bilan de Brouillon à Transmis_au_CS
     */
    public function transmettre($id)
    {
        $user = Auth::user();
        
        $bilan = BilanDivision::where('id', $id)
            ->where('division_id', $user->division_id)
            ->firstOrFail();

        if ($bilan->etat !== 'Brouillon') {
            return response()->json([
                'message' => 'Ce bilan a déjà été transmis ou est dans un état non modifiable.'
            ], 422);
        }

        $bilan->update([
            'etat' => 'Transmis_au_CS',
            'date_transmission' => now()
        ]);

        return response()->json([
            'message' => 'Bilan transmis avec succès au Conseil Scientifique.',
            'bilan' => $bilan
        ]);
    }

    public function telechargerPDF($id)
{
    try {
        // 1. Charger le bilan de division
        $bilanDivision = BilanDivision::with(['division', 'chefDivision'])->findOrFail($id);

        // 2. Charger les bilans projets liés via la table pivot
        // TRÈS IMPORTANT : Vérifiez que les noms des relations correspondent à vos modèles
        $bilansProjetsDetail = $bilanDivision->bilansProjets()->with([
            'projet.chefProjet',
            'productionsScientifiques', // Relation définie dans BilanAnnuel
            'productionsTechnologiques', // Relation définie dans BilanAnnuel
            'encadrements'              // Relation définie dans BilanAnnuel
        ])->get();

        $data = [
            'bilan'   => $bilanDivision,
            'projets' => $bilansProjetsDetail,
            'date'    => now()->format('d/m/Y')
        ];

        // 3. Forcer les limites pour les gros rapports
        ini_set('memory_limit', '512M');
        set_time_limit(0);

        $pdf = Pdf::loadView('pdfs.bilan_division_complet', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'defaultFont'          => 'sans-serif'
            ]);

        $fileName = "Bilan_Consolide_" . ($bilanDivision->division->acronyme ?? 'DIV') . ".pdf";
        return $pdf->download($fileName);

    } catch (\Exception $e) {
        \Log::error("Crash PDF Division ID {$id}: " . $e->getMessage());
        // On retourne l'erreur réelle en JSON pour que vous puissiez la lire sur l'écran
        return response()->json([
            'error' => 'Erreur technique',
            'details' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
}

}
