<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('taches', function (Blueprint $table) {
        // Au stade de proposition, on ne connaît pas forcément les dates exactes
        $table->date('date_debut')->nullable()->change();
        $table->date('date_fin')->nullable()->change();
    });

    Schema::table('livrables', function (Blueprint $table) {
        // Ces champs ne seront remplis que lors de la réalisation du projet
        $table->string('fichier_path')->nullable()->change();
        $table->date('date_depot')->nullable()->change();
        $table->foreignId('depose_par')->nullable()->change();
    });
}
};
