<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tache extends Model
{
    use HasFactory;

    protected $fillable = [
        'work_package_id',
        'nom',
        'description',
        'date_debut',
        'date_fin',
        'responsable_id',
        'etat'
    ];

    // La tâche fait partie d'un lot de travail
    public function workPackage()
    {
        return $this->belongsTo(WorkPackage::class);
    }

    // La tâche a un responsable unique (User)
    public function responsable()
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    // Lien inverse : permet de savoir à quel projet appartient la tâche
    public function projet()
    {
        return $this->workPackage->projet();
    }
}