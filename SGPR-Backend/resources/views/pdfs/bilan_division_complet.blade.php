<!DOCTYPE html>
<html lang="fr">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Bilan Annuel - {{ $bilan->division->acronyme ?? 'Division' }}</title>
    <style>
        @page {
            margin: 1.5cm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 9pt;
            color: #1e293b;
            line-height: 1.4;
        }

        /* Couleurs Institutionnelles CERIST */
        .color-primary {
            color: #1e3a8a;
        }

        .bg-primary {
            background-color: #1e3a8a;
            color: white;
        }

        .bg-light {
            background-color: #f8fafc;
        }

        /* En-tête */
        .header-table {
            width: 100%;
            border-bottom: 3px solid #1e3a8a;
            padding-bottom: 10px;
            margin-bottom: 20px;
            border-collapse: collapse;
        }

        .header-table td {
            border: none;
            vertical-align: middle;
        }

        .header-title {
            text-align: right;
        }

        .header-title h2 {
            margin: 0;
            font-size: 14pt;
            text-transform: uppercase;
        }

        /* Sections */
        .section-header {
            background-color: #f1f5f9;
            border-left: 5px solid #1e3a8a;
            padding: 8px 12px;
            font-size: 11pt;
            font-weight: bold;
            color: #1e3a8a;
            margin: 20px 0 10px 0;
            text-transform: uppercase;
        }

        /* Tableaux */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            table-layout: fixed;
        }

        th,
        td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            vertical-align: top;
            word-wrap: break-word;
        }

        th {
            background-color: #f8fafc;
            font-size: 8pt;
            text-transform: uppercase;
            color: #475569;
        }

        .label {
            background-color: #f8fafc;
            font-weight: bold;
            width: 30%;
        }

        /* Style spécifique Projets */
        .project-card {
            border: 1px solid #e2e8f0;
            padding: 15px;
            margin-bottom: 30px;
            page-break-inside: avoid;
        }

        .project-header {
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }

        .badge {
            background-color: #1e3a8a;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 8pt;
        }

        /* Footer */
        .footer {
            position: fixed;
            bottom: -0.8cm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #94a3b8;
        }
    </style>
</head>

<body>

    <div class="footer">
        Page {PAGENO} | Bilan Annuel {{ $bilan->annee }} - Division {{ $bilan->division->acronyme }} - CERIST
    </div>

    <table class="header-table">
        <tr>
            <td style="width: 50%;">
                <div style="font-weight: bold; font-size: 10pt;">MESRS</div>
                <div style="font-size: 9pt;">Centre de Recherche sur l'Information Scientifique et Technique</div>
            </td>
            <td class="header-title">
                <h2>Rapport d'Activités Scientifiques</h2>
                <div class="color-primary" style="font-weight: bold;">Division : {{ $bilan->division->nom }}</div>
                <div>Année Universitaire : {{ $bilan->annee }}</div>
            </td>
        </tr>
    </table>

    <div class="section-header">1. Potentiel Scientifique de la Division</div>
    <table>
        <tr>
            @php $count = 0; @endphp
            @foreach($bilan->statistiques_personnel as $grade => $total)
                <td style="text-align: center; border: 1px solid #e2e8f0; padding: 10px;">
                    <div style="font-size: 14pt; font-weight: bold; color: #1e3a8a;">{{ $total }}</div>
                    <div style="font-size: 7pt; color: #64748b; text-transform: uppercase;">
                        {{ str_replace('_', ' ', $grade) }}</div>
                </td>
                @php $count++; @endphp
                @if($count % 5 == 0)
                    </tr>
                <tr> @endif
            @endforeach
        </tr>
    </table>

    <div class="section-header">2. Activités Transversales</div>
    <table>
        <tr>
            <td class="label">Formation Qualifiante</td>
            <td>{{ $bilan->formation_qualifiante ?: 'Néant' }}</td>
        </tr>
        <tr>
            <td class="label">Séjours à l'étranger</td>
            <td>{{ $bilan->sejours_etranger ?: 'Néant' }}</td>
        </tr>
        <tr>
            <td class="label">Coopération & Partenariats</td>
            <td>{{ $bilan->cooperation_partenariat ?: 'Néant' }}</td>
        </tr>
    </table>

    <div style="page-break-after: always;"></div>

    <div class="section-header">3. État d'avancement des Projets de Recherche</div>

    @foreach($projets as $bp)
        <div class="project-card">
            <div class="project-header">
                <table style="border: none; margin: 0;">
                    <tr>
                        <td style="border: none; width: 75%;">
                            <h3 style="margin: 0; color: #1e3a8a;">{{ $bp->projet->titre }}</h3>
                        </td>
                        <td style="border: none; text-align: right;">
                            <span class="badge">Avancement : {{ $bp->avancement_physique }}%</span>
                        </td>
                    </tr>
                </table>
            </div>

            <table style="margin-bottom: 10px;">
                <tr>
                    <td class="label">Chef de Projet</td>
                    <td>{{ $bp->projet->chefProjet->nom ?? '' }} {{ $bp->projet->chefProjet->prenom ?? '' }}</td>
                    <td class="label">Type / Nature</td>
                    <td>{{ $bp->projet->type }} / {{ $bp->projet->nature }}</td>
                </tr>
            </table>

            <p style="font-weight: bold; margin-bottom: 5px;">Participants au projet :</p>
            <table style="font-size: 8pt;">
                <thead>
                    <tr>
                        <th>Nom & Prénom</th>
                        <th>Qualité</th>
                        <th style="width: 15%;">Participation</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($bp->projet->membres as $membre)
                        <tr>
                            <td>{{ $membre->nom }} {{ $membre->prenom }} ({{ $membre->grade }})</td>
                            <td>{{ $membre->pivot->qualite }}</td>
                            <td style="text-align: center;">{{ $membre->pivot->pourcentage_participation }}%</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <p style="font-weight: bold; margin-top: 10px; color: #475569;">4.1 Production Scientifique :</p>
            @if($bp->productionsScientifiques->count() > 0)
                <table style="font-size: 8.5pt;">
                    <thead>
                        <tr class="bg-light">
                            <th style="width: 20%;">Type</th>
                            <th>Détails Bibliographiques</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($bp->productionsScientifiques as $prod)
                            <tr>
                                <td><strong>{{ str_replace('_', ' ', $prod->type) }}</strong></td>
                                <td>{{ $prod->auteurs }}, "{{ $prod->titre }}", <i>{{ $prod->revue_ou_conference }}</i>,
                                    {{ $prod->date_parution }}.</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <p style="font-style: italic; font-size: 8pt; color: #94a3b8;">Aucune production signalée.</p>
            @endif

            <p style="font-weight: bold; margin-top: 10px; color: #475569;">4.2 Production Technologique :</p>
            @forelse($bp->productionsTechnologiques as $tech)
                <div style="margin-left: 10px; font-size: 8.5pt;">
                    • <strong>{{ $tech->intitule }}</strong> ({{ $tech->type }}) : {{ $tech->description }}
                    @if($tech->reference) <small>[Réf: {{ $tech->reference }}]</small> @endif
                </div>
            @empty
                <p style="font-style: italic; font-size: 8pt; color: #94a3b8; margin-left: 10px;">Néant.</p>
            @endforelse

            <p style="font-weight: bold; margin-top: 10px; color: #475569;">4.3 Formation par la Recherche :</p>
            @if($bp->encadrements->count() > 0)
                <table style="font-size: 8pt;">
                    <tr class="bg-light">
                        <th>Étudiant</th>
                        <th>Diplôme</th>
                        <th>Sujet</th>
                        <th>Établissement / État</th>
                    </tr>
                    @foreach($bp->encadrements as $enc)
                        <tr>
                            <td>{{ $enc->nom_etudiant }}</td>
                            <td>{{ $enc->type_diplome }}</td>
                            <td>{{ $enc->sujet }}</td>
                            <td>{{ $enc->etablissement }} ({{ $enc->etat_avancement }})</td>
                        </tr>
                    @endforeach
                </table>
            @else
                <p style="font-style: italic; font-size: 8pt; color: #94a3b8;">Aucun encadrement.</p>
            @endif

            @if($bp->difficultes_scientifiques || $bp->difficultes_materielles)
                <div
                    style="background-color: #fffaf0; border: 1px solid #feebc8; padding: 8px; margin-top: 10px; font-size: 8pt;">
                    <strong>Difficultés signalées :</strong><br>
                    @if($bp->difficultes_scientifiques) • Scientifiques: {{ $bp->difficultes_scientifiques }}<br> @endif
                    @if($bp->difficultes_materielles) • Matérielles: {{ $bp->difficultes_materielles }} @endif
                </div>
            @endif
        </div>
    @endforeach

</body>

</html>