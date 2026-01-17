<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BilanAnnuel;
use App\Models\Projet;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class BilanController extends Controller
{
    
    public function storeOuUpdate(Request $request, Projet $projet)
    {
        if (auth()->id() !== $projet->chef_projet_id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        $validated = $request->validate([
            'annee' => 'required|integer',
            'avancement_physique' => 'nullable|numeric|min:0|max:100',
            'objectifs_realises' => 'nullable|string',
            'collaborations' => 'nullable|string',
            'diff_scientifiques' => 'nullable|string',
            'diff_materielles' => 'nullable|string',
            'diff_humaines' => 'nullable|string',
            'autres_resultats' => 'nullable|string',
        ]);

        // On utilise updateOrCreate : si le bilan pour cette année existe, on le met à jour
        $bilan = BilanAnnuel::updateOrCreate(
            ['projet_id' => $projet->id, 'annee' => $validated['annee']],
            array_merge($validated, [
                // On s'assure que l'état ne change pas lors d'une simple mise à jour
                'etat_validation' => 'Brouillon'
            ])
        );

        return response()->json([
            'message' => 'Brouillon enregistré avec succès',
            'bilan' => $bilan
        ], 200);
    }

    /**
     * Soumettre définitivement le bilan.
     * Change l'état de 'Brouillon' à 'Soumis'.
     */
    public function soumettre(BilanAnnuel $bilan)
    {
        // Vérification que l'utilisateur est bien le chef du projet lié au bilan
        if (auth()->id() !== $bilan->projet->chef_projet_id) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        if ($bilan->etat_validation !== 'Brouillon') {
            return response()->json(['error' => 'Ce bilan a déjà été soumis ou validé.'], 400);
        }

        $bilan->update([
            'etat_validation' => 'Soumis',
            'updated_at' => now()
        ]);

        return response()->json([
            'message' => 'Bilan soumis officiellement à la division',
            'bilan' => $bilan
        ]);
    }

    /**
     * Générer le PDF (uniquement si le bilan existe)
     */
    public function telechargerPDF(BilanAnnuel $bilan)
    {
        $projet = $bilan->projet->load(['chefProjet', 'division', 'membres.division']);
        
        $productionsSci = $projet->productionsScientifiques()->where('annee', $bilan->annee)->get(); 
        $productionsTech = $projet->productionsTechnologiques()->where('annee', $bilan->annee)->get(); 
        $encadrements = $bilan->encadrements;

        $pdf = Pdf::loadView('pdfs.bilan', [
            'bilan' => $bilan,
            'projet' => $projet,
            'annee' => $bilan->annee,
            'productionsSci' => $productionsSci,
            'productionsTech' => $productionsTech,
            'encadrements' => $encadrements
        ]);

        return $pdf->setPaper('a4', 'portrait')->download("Bilan_{$projet->id}.pdf");
    }
}