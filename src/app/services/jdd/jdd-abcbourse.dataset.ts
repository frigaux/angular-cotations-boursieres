import {DTOInformationsTickerABCBourse} from '../abc-bourse/dto-informations-ticker-abc-bourse.class';
import {DTOIdentiteTickerAbcbourse} from '../abc-bourse/dto-identite-ticker-abcbourse';

export const DTO_INFORMATIONS_TICKER_ABCBOURSE: DTOInformationsTickerABCBourse = {
  "ticker": "GLE",
  "cotations": {
    "cours": 57.98,
    "volume": 1943311,
    "ouverture": 58.72,
    "plusHaut": 58.84,
    "plusBas": 57.08,
    "clotureVeille": 59.16,
    "pourcentageVolatilite": 0.03,
    "pourcentageCapitalEchange": 0.0025,
    "valorisation": "44 396 M€"
  },
  "ratios": {
    "indicateurs": [
      {
        "annee": 2026,
        "bnpa": 7.14,
        "per": 8.12
      },
      {
        "annee": 2025,
        "bnpa": 6.31,
        "per": 9.18
      },
      {
        "annee": 2024,
        "bnpa": 4.16,
        "per": 13.93
      }
    ],
    "variationCAC": 1.22,
    "correlationCAC": 0.5978,
    "qualiteFinanciere": "12/20"
  },
  "actualites": [
    {
      "date": "2025-11-13",
      "titre": "Sort par le haut d'un corridor 53/58,8E",
      "pathname": "/marches/ste-generale-sort-par-le-haut-d-un-corridor-5358-8e_680140"
    },
    {
      "date": "2025-11-10",
      "titre": "Société Générale refranchit le cap des 56,7 euros",
      "pathname": "/marches/ste-generale-refranchit-le-cap-des-56-7e_679866"
    },
    {
      "date": "2025-11-07",
      "titre": "Société Générale annule près de 18,3 millions d'actions",
      "pathname": "/marches/societe-generale-annule-pres-de-18-3-millions-d-actions_679757"
    },
    {
      "date": "2025-11-06",
      "titre": "Renoue avec les 56E, peut de nouveau viser les 59E",
      "pathname": "/marches/ste-generale-renoue-avec-les-56e-peut-de-nouveau-viser-les-59e_679621"
    },
    {
      "date": "2025-10-30",
      "titre": "L'absence de rachat d'actions assombrit une publication de qual...",
      "pathname": "/marches/l-absence-de-rachat-d-actions-assombrit-une-publication-de-qualite-de-societe-ge_678938"
    },
    {
      "date": "2025-10-30",
      "titre": "Société Générale dépasse les attentes trimestrielles",
      "pathname": "/marches/societe-generale-depasse-les-attentes-trimestrielles_678869"
    }
  ],
  "variations": [
    {
      "duree": "1 semaine",
      "pourcentage": 0.0611
    },
    {
      "duree": "1 mois",
      "pourcentage": 0.0538
    },
    {
      "duree": "1er janvier",
      "pourcentage": 1.1348
    },
    {
      "duree": "1 an",
      "pourcentage": 1.224
    },
    {
      "duree": "3 ans",
      "pourcentage": 1.4013
    },
    {
      "duree": "5 ans",
      "pourcentage": 2.6012
    },
    {
      "duree": "10 ans",
      "pourcentage": 0.3356
    }
  ],
  "dividendes": [
    {
      "annee": 2025,
      "montant": 1.7
    },
    {
      "annee": 2024,
      "montant": 0.9
    },
    {
      "annee": 2023,
      "montant": 1.7
    },
    {
      "annee": 2022,
      "montant": 1.65
    },
    {
      "annee": 2021,
      "montant": 0.55
    }
  ]
};

export const DTO_IDENTITE_TICKER_ABCBOURSE: DTOIdentiteTickerAbcbourse = {
  "aPropos": "\n        \n    Société Générale figure parmi les 1ers groupes bancaires français. Le Produit Net Bancaire (PNB) par activité se répartit comme suit :\n    -banque de financement et d'investissement (37,7%) : financements spécialisés (d'acquisitions, de projets, etc.), interventions sur les marchés actions, de taux, de change et de matières premières, opérations sur actions, conseil en fusions-acquisitions, activités de banque commerciale, etc. ;\n    -banque de détail en France (33,4% ; SG). En outre, le groupe développe des activités de gestion d'actifs et de banque privée (137 MdsEUR d’actifs gérés en 2025), et propose des prestations d’assurances, de banque en ligne et de courtage en ligne (Boursorama Banque) ainsi qu'un site d'informations économiques et financières (boursorama.com) ;\n    -prestations de services financiers spécialisés et d'assurance à l’international (15,6%) : crédit à la consommation, crédit-bail, gestion de flottes automobiles, financement de biens d’équipement professionnels et assurances ;\n    -banque de détail à l'international (13,3%).\n    A fin 2025, Société Générale gère 519,8 MdsEUR d'encours de dépôts et 454,5 MdsEUR d'encours de crédits.\n    La répartition géographique du PNB est la suivante : France (44,4%), Europe (34,9%), Amériques (10,2%), Asie et Océanie (5,6%) et Afrique (4,9%).\n    \n        ",
  "marche": "Compartiment A",
  "place": "Euronext Paris (France)",
  "secteur": "Banque",
  "indices": "CAC 40, CAC 40 ESG, CAC All Shares, CAC All-Tradable, CAC Large 60, Euronext 100,  SBF 120, STOXX Europe 600",
  "nombreTitres": 744394214,
  "adresse": "\n                            29 Boulevard Haussmann FR-75009 ParisFrance\n                        ",
  "telephone": "+33 (0)1 42 14 20 00",
  "dateAssemblee": "2026-05-27"
};
