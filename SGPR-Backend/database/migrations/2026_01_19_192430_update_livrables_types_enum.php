<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Très important

return new class extends Migration
{
    public function up(): void
    {
        // 1. On supprime l'ancienne contrainte CHECK générée par Laravel pour l'ENUM
        // Le nom de la contrainte dans Postgres est généralement table_colonne_check
        DB::statement('ALTER TABLE livrables DROP CONSTRAINT IF EXISTS livrables_type_check');

        // 2. On définit la nouvelle liste des types
        $types = [
            'Rapport_Technique', 'Manuel_Utilisateur', 'Code_Source', 
            'Synthese_Biblio', 'Expertise', 'Logiciel_Code', 
            'Prototype', 'Publication', 'Brevet', 'Autre'
        ];
        
        // On crée la chaîne SQL : 'Rapport_Technique', 'Manuel_Utilisateur', ...
        $typesString = implode("', '", $types);

        // 3. On applique la nouvelle contrainte
        DB::statement("ALTER TABLE livrables ADD CONSTRAINT livrables_type_check CHECK (type IN ('$typesString'))");
    }

    public function down(): void
    {
        // En cas de rollback, on revient à la liste initiale
        DB::statement('ALTER TABLE livrables DROP CONSTRAINT IF EXISTS livrables_type_check');
        
        $oldTypes = ['Rapport_Technique', 'Manuel_Utilisateur', 'Code_Source', 'Synthese_Biblio', 'Expertise'];
        $oldTypesString = implode("', '", $oldTypes);
        
        DB::statement("ALTER TABLE livrables ADD CONSTRAINT livrables_type_check CHECK (type IN ('$oldTypesString'))");
    }
};