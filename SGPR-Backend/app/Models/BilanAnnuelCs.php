<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilanAnnuelCs extends Model
{
    use HasFactory;

    protected $table = 'bilans_annuels_cs';

    protected $fillable = [
        'session_id',
        'annee',
        'introduction_generale',
        'synthese_nationale_scientifique',
        'recommandations_strategiques',
        'etat',
        'responsable_cs_id'
    ];

    // La session du CS rattachée
    public function sessionCs()
    {
        return $this->belongsTo(SessionCs::class, 'session_id');
    }

    // Le responsable du CS (souvent le Président ou Chef CS)
    public function responsableCs()
    {
        return $this->belongsTo(User::class, 'responsable_cs_id');
    }

    // RELATION DE REGROUPEMENT :
    // Regroupe les bilans des divisions pour la session annuelle
    public function bilansDivisions()
    {
        return $this->belongsToMany(BilanDivision::class, 'bilan_cs_items', 'bilan_cs_id', 'bilan_division_id');
    }
}
