<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'nature',        // Recherche, Développement, Exploratoire
        'type',          // Interne, PNR, Coopération, etc.
        'resume',
        'problematique',
        'objectifs',
        'duree_mois',
        'date_debut',
        'date_fin',
        'statut',        // Proposé, Validé, enCours, Terminé, etc.
        'chef_projet_id',
        'division_id'
    ];

    // --- RELATIONS STRUCTURELLES ---

    // Le projet appartient à une division (I.1 du canevas)
    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    // Le projet est dirigé par un chercheur (Chef de projet)
    public function chefProjet()
    {
        return $this->belongsTo(User::class, 'chef_projet_id');
    }

    // L'équipe complète (Participants au projet - V.1 du canevas)
    // Utilise la table pivot 'participation'
    public function membres()
    {
        return $this->belongsToMany(User::class, 'participation')
                    ->withPivot('pourcentage_participation', 'qualite')
                    ->withTimestamps();
    }

    // --- RELATIONS DE PLANIFICATION ---

    // Un projet est divisé en Lots de travail (WP) (V.3 du canevas)
    public function workPackages()
    {
        return $this->hasMany(WorkPackage::class);
    }

    // Accès direct à toutes les tâches du projet via les WP
    public function taches()
    {
        return $this->hasManyThrough(Tache::class, WorkPackage::class);
    }

    // --- RELATIONS DE RÉSULTATS ---

    // Les bilans annuels produits pour ce projet
    public function bilansAnnuels()
    {
        return $this->hasMany(BilanAnnuel::class);
    }

    // Les fichiers officiels (Rapports déposés à la bibliothèque, etc.)
    public function livrables()
    {
        return $this->hasMany(Livrable::class);
    }
}
