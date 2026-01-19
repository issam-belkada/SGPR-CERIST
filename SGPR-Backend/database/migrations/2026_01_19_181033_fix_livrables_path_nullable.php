<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('livrables', function (Blueprint $table) {
            // Rend la colonne fichier_path capable d'accepter des valeurs nulles
            $table->string('fichier_path')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('livrables', function (Blueprint $table) {
            $table->string('fichier_path')->nullable(false)->change();
        });
    }
};