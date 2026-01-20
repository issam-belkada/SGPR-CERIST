<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livrable extends Model
{
    use HasFactory;

    protected $fillable = [
        'projet_id',
        'tache_id',
        'titre',
        'type',
        'fichier_path',
        'date_depot',
        'depose_par'
    ];

    // Le livrable appartient à un projet
    public function projet()
    {
        return $this->belongsTo(Projet::class);
    }

    // Optionnel : lié à une tâche spécifique d'un WP
    public function tache()
    {
        return $this->belongsTo(Tache::class);
    }

    // Le chercheur qui a effectué le dépôt
    public function depositaire()
    {
        return $this->belongsTo(User::class, 'depose_par');
    }
}
