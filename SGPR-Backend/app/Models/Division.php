<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    use HasFactory;

    protected $fillable = ['nom', 'acronyme'];

    // Une division a plusieurs utilisateurs (Chercheurs, Chefs...)
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Une division a plusieurs projets domiciliés chez elle
    public function projets()
    {
        return $this->hasMany(Projet::class);
    }

    // Une division produit plusieurs bilans de synthèse
    public function bilans()
    {
        return $this->hasMany(BilanDivision::class);
    }
}
