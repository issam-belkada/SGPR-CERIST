<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        @page { margin: 1.5cm; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 11px; color: #000; line-height: 1.4; }
        .title-box { text-align: center; border: 2px solid #000; padding: 10px; margin-bottom: 20px; font-weight: bold; font-size: 14px; background: #f9f9f9; }
        .section-header { background: #e0e0e0; border: 1px solid #000; padding: 5px; font-weight: bold; margin-top: 15px; text-transform: uppercase; }
        .content-block { border: 1px solid #000; border-top: none; padding: 10px; min-height: 40px; }
        table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #f2f2f2; font-weight: bold; }
        .label { font-weight: bold; color: #333; }
        ul { margin: 5px 0; padding-left: 20px; }
        li { margin-bottom: 3px; }
    </style>
</head>
<body>

    <div class="title-box">
        BILAN PROJET : {{ $projet->titre }} (Année : {{ $annee }}) [cite: 1]
    </div>

    <div class="section-header">1. STRUCTURE DE RATTACHEMENT [cite: 2]</div>
    <div class="content-block">
        <p><span class="label">Division / Département / Plateforme :</span> {{ $projet->division->nom }} [cite: 3]</p>
        <p><span class="label">Equipe ou Service :</span> {{ $projet->equipe_service ?? 'Non précisé' }} [cite: 4]</p>
    </div>

    <div class="section-header">2. IDENTIFICATION DU PROJET [cite: 5]</div>
    <div class="content-block">
        <p><span class="label">Type du projet ({{ $projet->nature }}) :</span> {{ $projet->type }} [cite: 6, 7]</p>
        <p><span class="label">Intitulé :</span> {{ $projet->titre }} [cite: 8]</p>
        <p><span class="label">Chef de projet :</span> {{ $projet->chefProjet->nom }} {{ $projet->chefProjet->prenom }} [cite: 9]</p>
        <p><span class="label">Dates :</span> Du {{ $projet->date_debut->format('d/m/Y') }} au {{ $projet->date_fin->format('d/m/Y') }} [cite: 10, 11]</p>
        <p><span class="label">Partenaire :</span> {{ $projet->partenaire ?? 'Néant' }} [cite: 12]</p>
        
        <p class="label" style="margin-top:10px;">Participants au projet : [cite: 13]</p>
        <table>
            <thead>
                <tr>
                    <th>NOM et Prénom [cite: 14]</th>
                    <th>Grade [cite: 15, 17]</th>
                    <th>Qualité [cite: 16]</th>
                    <th>Structure [cite: 20]</th>
                    <th>% Part. [cite: 21]</th>
                </tr>
            </thead>
            <tbody>
                @foreach($projet->membres as $m)
                <tr>
                    <td>{{ $m->nom }} {{ $m->prenom }}</td>
                    <td>{{ $m->grade }}</td>
                    <td>{{ $m->pivot->qualite }}</td>
                    <td>{{ $m->division->acronyme ?? 'CERIST' }}</td>
                    <td>{{ $m->pivot->pourcentage_participation }}%</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <p style="margin-top:10px;"><span class="label">Estimation de l'état d'avancement global :</span> {{ $bilan->avancement_physique }}% </p>
    </div>

    <div class="section-header">3. OBJECTIFS DU PROJET </div>
    <div class="content-block">
        <strong>Objectifs initiaux :</strong><br>
        {{ $projet->objectifs }}<br><br>
        <strong>Réalisations de l'année :</strong><br>
        {{ $bilan->objectifs_realises }}
    </div>

    <div class="section-header">4. RÉSULTATS QUANTIFIÉS [cite: 23]</div>
    <div style="padding: 10px; border: 1px solid #000; border-top: none;">
        
        <p class="label">4.1 PRODUCTION SCIENTIFIQUE (Livres, Publications, etc.) : [cite: 24]</p>
        <ul>
            @forelse($productionsSci as $ps)
                <li>[{{ $ps->type }}] {{ $ps->titre }} - <em>{{ $ps->revue_conference }}</em> ({{ $ps->annee }})</li>
            @empty
                <li>Néant</li>
            @endforelse
        </ul>

        <p class="label">4.2 PRODUCTION TECHNOLOGIQUE (Logiciels, Brevets, etc.) : [cite: 25]</p>
        <ul>
            @forelse($productionsTech as $pt)
                <li><strong>{{ $pt->type }} :</strong> {{ $pt->intitule }} - {{ $pt->description }}</li>
            @empty
                <li>Néant</li>
            @endforelse
        </ul>

        <p class="label">4.3 FORMATION POUR LA RECHERCHE (Encadrements) : [cite: 35]</p>
        <ul>
            @forelse($encadrements as $e)
                <li><strong>{{ $e->type_diplome }} :</strong> {{ $e->nom_etudiant }} - Sujet : {{ $e->sujet }} ({{ $e->etat_avancement }})</li>
            @empty
                <li>Néant</li>
            @endforelse
        </ul>

        <p class="label">4.4 AUTRES : </p>
        <p>{{ $bilan->autres_resultats ?? 'Néant' }}</p>
    </div>

    <div class="section-header">5. COLLABORATION [cite: 48]</div>
    <div class="content-block">
        {{ $bilan->collaborations ?? 'Néant' }} [cite: 48]
    </div>

    <div class="section-header">6. DIFFICULTÉS RENCONTRÉES [cite: 51]</div>
    <div class="content-block">
        <p><span class="label">6.1 Sur le plan scientifique :</span><br> {{ $bilan->diff_scientifiques ?? 'Néant' }} [cite: 52]</p>
        <p><span class="label">6.2 Sur le plan matériel :</span><br> {{ $bilan->diff_materielles ?? 'Néant' }} [cite: 55]</p>
        <p><span class="label">6.3 Ressource Humaine :</span><br> {{ $bilan->diff_humaines ?? 'Néant' }} [cite: 58]</p>
    </div>

    <div style="margin-top: 30px;">
        <table style="border: none;">
            <tr>
                <td style="border: none; width: 50%; text-align: center;">
                    <strong>Signature du Chef de Projet</strong><br><br><br><br>
                    ..........................................
                </td>
                <td style="border: none; width: 50%; text-align: center;">
                    <strong>Visa du Chef de Division</strong><br><br><br><br>
                    ..........................................
                </td>
            </tr>
        </table>
    </div>

</body>
</html>