<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    // 1. Supprimer l'ancienne contrainte si elle existe
    DB::statement("ALTER TABLE bilans_annuels DROP CONSTRAINT IF EXISTS bilans_annuels_etat_validation_check");

    // 2. Convertir temporairement la colonne en texte simple
    DB::statement("ALTER TABLE bilans_annuels ALTER COLUMN etat_validation TYPE VARCHAR(255)");

    // 3. Nettoyer les données (enlever les accents)
    DB::table('bilans_annuels')->where('etat_validation', 'Validé')->update(['etat_validation' => 'Valide']);
    DB::table('bilans_annuels')->where('etat_validation', 'Rejeté')->update(['etat_validation' => 'Rejete']);

    // 4. Ajouter la nouvelle contrainte propre (sans accents)
    DB::statement("ALTER TABLE bilans_annuels ADD CONSTRAINT bilans_annuels_etat_validation_check 
                   CHECK (etat_validation IN ('Brouillon', 'Soumis', 'Valide', 'Rejete'))");
}


};
