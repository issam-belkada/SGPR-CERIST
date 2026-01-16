<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SessionCs extends Model
{
    use HasFactory;

    protected $table = 'sessions_cs';

    protected $fillable = ['date_session', 'lieu', 'ordre_du_jour', 'pv_file_path', 'statut'];

    // Une session traite plusieurs décisions de projets
    public function decisions()
    {
        return $this->hasMany(DecisionCs::class, 'session_id');
    }

    // Une session génère un bilan annuel global du centre
    public function bilanAnnuelGlobal()
    {
        return $this->hasOne(BilanAnnuelCs::class, 'session_id');
    }
}
