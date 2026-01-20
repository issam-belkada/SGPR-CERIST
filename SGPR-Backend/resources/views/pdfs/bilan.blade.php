<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Bilan Annuel - {{ $annee }}</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #333;
        }

        .header {
            text-align: center;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .section-title {
            background-color: #f2f2f2;
            padding: 5px;
            font-weight: bold;
            border: 1px solid #ccc;
            margin-top: 15px;
            text-transform: uppercase;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #999;
            padding: 6px;
            text-align: left;
            font-size: 10pt;
        }

        th {
            background-color: #e9e9e9;
        }

        .field-label {
            font-weight: bold;
            width: 30%;
        }

        .progression {
            font-size: 14pt;
            color: #d32f2f;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
            border: 2px dashed #d32f2f;
            padding: 10px;
        }
    </style>
</head>

<body>

    <div class="header">
        BILAN PROJET : {{ $projet->titre }} (Année : {{ $annee }}) [cite: 1]
    </div>

    <div class="section-title">1. STRUCTURE DE RATTACHEMENT [cite: 2]</div>
    <table>
        <tr>
            <td class="field-label">Division / Département :</td>
            <td>{{ $projet->division->nom ?? 'N/A' }} [cite: 3]</td>
        </tr>
        <tr>
            <td class="field-label">Equipe ou Service :</td>
            <td>{{ $projet->equipe_service ?? 'N/A' }} [cite: 4]</td>
        </tr>
    </table>

    <div class="section-title">2. IDENTIFICATION DU PROJET [cite: 5]</div>
    <table>
        <tr>
            <td class="field-label">Type du projet :</td>
            <td>{{ $projet->nature }} [cite: 6, 7]</td>
        </tr>
        <tr>
            <td class="field-label">Intitulé :</td>
            <td>{{ $projet->titre }} [cite: 8]</td>
        </tr>
        <tr>
            <td class="field-label">Chef de projet :</td>
            <td>{{ $projet->chefProjet->nom }} {{ $projet->chefProjet->prenom }} [cite: 9]</td>
        </tr>
        <tr>
            <td class="field-label">Dates (Début - Fin) :</td>
            <td>Du {{ $projet->date_debut->format('d/m/Y') }} au {{ $projet->date_fin->format('d/m/Y') }} [cite: 10, 11]
            </td>
        </tr>
    </table>

    <div class="progression">
        ESTIMATION DE L'ÉTAT D'AVANCEMENT DU PROJET : {{ $bilan->avancement_physique }}%
    </div>

    <div class="section-title">Participants au projet [cite: 13]</div>
    <table>
        <thead>
            <tr>
                <th>NOM et Prénom [cite: 14]</th>
                <th>Grade [cite: 15]</th>
                <th>Qualité [cite: 16]</th>
                <th>% Participation [cite: 21]</th>
            </tr>
        </thead>
        <tbody>
            @foreach($projet->membres as $membre)
                <tr>
                    <td>{{ $membre->nom }} {{ $membre->prenom }}</td>
                    <td>{{ $membre->grade ?? 'N/A' }}</td>
                    <td>{{ $membre->pivot->qualite ?? 'Membre' }}</td>
                    <td>{{ $membre->pivot->pourcentage_participation ?? 0 }}%</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="section-title">3. OBJECTIFS DU PROJET [cite: 22]</div>
    <div style="padding: 10px; border: 1px solid #ccc; min-height: 50px;">
        {{ $bilan->objectifs_realises ?? 'Aucun objectif spécifié pour cette période.' }}
    </div>

    <div class="section-title">4. RÉSULTATS QUANTIFIÉS [cite: 23]</div>

    <h3>4.1 Production Scientifique [cite: 24]</h3>
    <table>
        <thead>
            <tr>
                <th>Type</th>
                <th>Titre / Revue</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @forelse($productionsSci as $sci)
                <tr>
                    <td>{{ str_replace('_', ' ', $sci->type) }}</td>
                    <td><strong>{{ $sci->titre }}</strong><br>{{ $sci->revue_ou_conference }}</td>
                    <td>{{ \Carbon\Carbon::parse($sci->date_parution)->format('m/Y') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3">Aucune production scientifique enregistrée.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <h3>4.2 Production Technologique [cite: 25]</h3>
    <ul>
        @forelse($productionsTech as $tech)
            <li><strong>{{ $tech->type }} :</strong> {{ $tech->intitule }} (Ref: {{ $tech->reference ?? 'N/A' }}) [cite: 26,
                29, 32]</li>
        @empty
            <li>Néant</li>
        @endforelse
    </ul>

    <h3>4.3 Formation pour la Recherche [cite: 35]</h3>
    <table>
        <thead>
            <tr>
                <th>Étudiant [cite: 36, 40, 43]</th>
                <th>Diplôme [cite: 39, 42]</th>
                <th>Sujet [cite: 43]</th>
                <th>État</th>
            </tr>
        </thead>
        <tbody>
            @forelse($encadrements as $enc)
                <tr>
                    <td>{{ $enc->nom_etudiant }}</td>
                    <td>{{ $enc->type_diplome }}</td>
                    <td>{{ $enc->sujet }}</td>
                    <td>{{ $enc->etat_avancement }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="4">Aucun encadrement enregistré.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="section-title">6. DIFFICULTÉS RENCONTRÉES [cite: 51]</div>
    <p><strong>6.1 Plan scientifique :</strong> {{ $bilan->diff_scientifiques ?? 'Néant' }} [cite: 52]</p>
    <p><strong>6.2 Plan matériel :</strong> {{ $bilan->diff_materielles ?? 'Néant' }} [cite: 55]</p>
    <p><strong>6.3 Ressource humaine :</strong> {{ $bilan->diff_humaines ?? 'Néant' }} [cite: 58]</p>

</body>

</html>