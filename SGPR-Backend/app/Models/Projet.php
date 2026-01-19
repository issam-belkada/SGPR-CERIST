<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Projet extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'nature',           // Recherche, Développement, Autres...
        'type',             // Interne, PNR, Coopération, etc.
        'equipe_service',   // Equipe ou Service de rattachement
        'partenaire',       // Partenaire du projet
        'resume',
        'problematique',
        'objectifs',        //  Objectifs du projet
        'duree_mois',
        'date_debut',       // Date de démarrage
        'date_fin',         // Date de fin
        'statut',
        'chef_projet_id',   // Chef de projet
        'division_id'       // Division
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // --- RELATIONS STRUCTURELLES (Section 1 & 2) ---

    /**
     * Structure de rattachement : Division [cite: 3]
     */
    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    /**
     * Identification : Chef de projet [cite: 9]
     */
    public function chefProjet()
    {
        return $this->belongsTo(User::class, 'chef_projet_id');
    }

    /**
     * Participants au projet (Section 2. Participants) 
     * Inclut : Grade, Qualité, Structure et % de participation [cite: 15, 16, 20, 21]
     */
    public function membres()
    {
        return $this->belongsToMany(User::class, 'participation', 'projet_id', 'user_id')
                    ->withPivot('pourcentage_participation', 'qualite')
                    ->withTimestamps();
    }

    // --- RELATIONS DE RÉSULTATS (Section 4) ---

    /**
     * Bilans Annuels (Regroupe les résultats par année) [cite: 1]
     */
    public function bilansAnnuels()
    {
        return $this->hasMany(BilanAnnuel::class);
    }

    /**
     * 4.1 Production Scientifique (Livres, publications, etc.) [cite: 24]
     */
    public function productionsScientifiques()
    {
        return $this->hasMany(ProductionScientifique::class);
    }

    /**
     * 4.2 Production Technologique (Produits, logiciels, brevets) [cite: 25]
     */
    public function productionsTechnologiques()
    {
        return $this->hasMany(ProductionTechnologique::class);
    }

    /**
     * 4.3 Formation pour la recherche (PFE, Master, Doctorat) [cite: 35]
     */
    public function encadrements()
    {
        return $this->hasManyThrough(Encadrement::class, BilanAnnuel::class);
    }

    // --- LOGIQUE MÉTIER ---

    /**
     * Calcule l'avancement global basé sur le dernier bilan [cite: 19]
     */
    public function getDernierAvancementAttribute()
    {
        return $this->bilansAnnuels()->latest()->first()?->avancement_physique ?? 0;
    }


    public function workPackages()
{
    return $this->hasMany(WorkPackage::class);
}
}