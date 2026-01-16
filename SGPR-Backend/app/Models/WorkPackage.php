<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkPackage extends Model
{
    use HasFactory;

    protected $fillable = ['projet_id', 'code_wp', 'titre', 'objectifs'];

    // Un WP appartient à un seul projet
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    // Un WP contient plusieurs tâches (Section V.3.2)
    public function taches()
    {
        return $this->hasMany(Tache::class);
    }
}
