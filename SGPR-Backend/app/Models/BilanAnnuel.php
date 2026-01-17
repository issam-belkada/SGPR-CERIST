<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilanAnnuel extends Model
{
    use HasFactory;

    protected $table = 'bilans_annuels'; // Précision car pluriel particulier

    protected $fillable = [
    'projet_id',
    'annee',
    'avancement_physique',
    'objectifs_realises',
    'collaborations',
    'difficultes_scientifiques',
    'difficultes_materielles',
    'difficultes_humaines',
    'autres_resultats',
    'etat_validation'
];

    // --- RELATIONS ---

    // Le bilan appartient à un projet spécifique
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    // Section 4.1 : Production Scientifique (Publications, Livres...)
    public function productionsScientifiques()
    {
        return $this->hasMany(ProductionScientifique::class, 'bilan_id');
    }

    // Section 4.2 : Production Technologique (Logiciels, Brevets...)
    public function productionsTechnologiques()
    {
        return $this->hasMany(ProductionTechnologique::class, 'bilan_id');
    }

    // Section 4.3 : Formation (Encadrements d'étudiants)
    public function encadrements()
    {
        return $this->hasMany(Encadrement::class, 'bilan_id');
    }
}
