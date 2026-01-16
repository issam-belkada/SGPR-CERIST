<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DecisionCs extends Model
{
    use HasFactory;

    protected $table = 'decisions_cs';

    protected $fillable = [
        'session_id',
        'projet_id',
        'avis', // Favorable, Favorable_sous_reserve, Défavorable
        'observations'
    ];

    // La décision est prise lors d'une session précise
    public function session()
    {
        return $this->belongsTo(SessionCs::class, 'session_id');
    }

    // La décision concerne un projet précis
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }
}