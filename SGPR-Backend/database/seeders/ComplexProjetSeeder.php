<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Projet;
use App\Models\Division;
use App\Models\WorkPackage;
use App\Models\Tache;
use Illuminate\Support\Facades\Hash;

class ComplexProjetSeeder extends Seeder
{
    public function run()
    {
        // 1. Création de 15 chercheurs (5 par division)
        $divisions = [1, 2, 3];
        $allNewResearchers = collect();

        foreach ($divisions as $divId) {
            for ($i = 1; $i <= 5; $i++) {
                $user = User::create([
                    'nom' => "Chercheur_{$divId}_{$i}",
                    'prenom' => "Prenom",
                    'email' => "chercheur{$divId}.{$i}@cerist.dz",
                    'password' => Hash::make('password'),
                    'grade' => 'AR',
                    'specialite' => 'Informatique',
                    'division_id' => $divId,
                ]);
                $user->assignRole('Chercheur');
                $allNewResearchers->push($user);
            }
        }

        // 2. Création des projets (un par division)
        // On donne le projet de la division 3 à l'utilisateur 12
        $projectsData = [
            ['div' => 1, 'chef' => 12, 'titre' => 'Cloud National Algérien', 'acr' => 'CNA'],
            ['div' => 2, 'chef' => $allNewResearchers->first()->id, 'titre' => 'Sécurité des Objets Connectés', 'acr' => 'SOC'],
            ['div' => 3, 'chef' => 12, 'titre' => 'Intelligence Artificielle et Santé', 'acr' => 'IAS'],
        ];

        foreach ($projectsData as $data) {
            $projet = Projet::create([
                'titre' => $data['titre'],
                'nature' => 'Recherche',
                'type' => 'PNR',
                'resume' => "Résumé du projet " . $data['acr'],
                'duree_mois' => 24,
                'date_debut' => now(),
                'date_fin' => now()->addYears(2),
                'statut' => 'enCours',
                'chef_projet_id' => $data['chef'],
                'division_id' => $data['div'],
            ]);

            // 3. Ajouter Ryad (ID 14) comme participant dans CHAQUE projet
            $projet->membres()->attach(14, [
                'pourcentage_participation' => 30,
                'qualite' => 'permanent'
            ]);

            // Ajouter d'autres membres de la même division au projet
            $divMembers = $allNewResearchers->where('division_id', $data['div'])->take(3);
            foreach ($divMembers as $member) {
                $projet->membres()->attach($member->id, [
                    'pourcentage_participation' => 20,
                    'qualite' => 'associé'
                ]);
            }

            // 4. Créer 2 Work Packages par projet
            for ($w = 1; $w <= 2; $w++) {
                $wp = WorkPackage::create([
                    'projet_id' => $projet->id,
                    'code_wp' => "WP{$w}",
                    'titre' => "Analyse et Spécifications " . $data['acr'] . " Part {$w}",
                    'objectifs' => "Objectifs du lot de travail {$w}",
                ]);

                // 5. Créer des tâches pour chaque WP
                // On assigne une tâche spécifiquement à Ryad (ID 14)
                Tache::create([
                    'work_package_id' => $wp->id,
                    'nom' => "Tâche de recherche pour Ryad - WP{$w}",
                    'description' => "Analyse approfondie des besoins utilisateur.",
                    'date_debut' => now(),
                    'date_fin' => now()->addMonth(),
                    'responsable_id' => 14, // Ryad est responsable de cette tâche
                    'etat' => 'En cours'
                ]);

                // Une autre tâche pour un autre chercheur
                Tache::create([
                    'work_package_id' => $wp->id,
                    'nom' => "Développement module " . $w,
                    'description' => "Codage des composants de base.",
                    'date_debut' => now(),
                    'date_fin' => now()->addMonth(),
                    'responsable_id' => $divMembers->random()->id,
                    'etat' => 'A faire'
                ]);
            }
        }
    }
}