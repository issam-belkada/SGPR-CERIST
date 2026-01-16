<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilanDivision extends Model
{
    use HasFactory;

    protected $table = 'bilans_divisions';

    protected $fillable = [
        'division_id',
        'annee',
        'statistiques_personnel', // Champ JSON pour stocker le nombre de PR, DR, MCA, etc.
        'formation_qualifiante',
        'sejours_etranger',
        'animation_scientifique',
        'cooperation_partenariat',
        'etat',
        'chef_division_id'
    ];

    // Cast automatique du JSON en tableau PHP pour manipulation facile
    protected $casts = [
        'statistiques_personnel' => 'array',
    ];

    // La division concernée
    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    // Le Chef de Division qui a rédigé le bilan
    public function chefDivision()
    {
        return $this->belongsTo(User::class, 'chef_division_id');
    }

    // RELATION DE REGROUPEMENT :
    // Permet de lier ce bilan de division à plusieurs bilans annuels de projets
    public function bilansProjets()
    {
        return $this->belongsToMany(BilanAnnuel::class, 'bilan_division_items', 'bilan_division_id', 'bilan_projet_id');
    }
}
