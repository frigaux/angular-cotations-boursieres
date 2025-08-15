import {DTOCoursTicker} from "../cours/dto-cours-ticker.interface";
import {DTOCoursTickerAllege} from '../cours/dto-cours-ticker-allege.interface';
import {DTOListeCours} from '../cours/dto-liste-cours.interface';
import {Cours} from '../../components/cours/cours.class';
import {DTOCoursAvecListeAllege} from '../cours/dto-cours-avec-liste-allege.interface';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';
import {VALEUR} from './jdd-valeurs.dataset';
import {DTOFiltre} from '../cours/dto-filtre.interface';

export const LISTE_COURS: DTOListeCours = {
  "date": "2025-05-09",
  "cours": [
    {
      "ticker": "GLE",
      "ouverture": 46.23,
      "plusHaut": 46.82,
      "plusBas": 46.06,
      "cloture": 46.8,
      "volume": 2141570,
      "moyennesMobiles": [
        46.8,
        46.68
      ]
    }
  ]
};

export const COURS_TICKER: DTOCoursTicker = {
  "date": "2025-05-09",
  "ouverture": 46.23,
  "plusHaut": 46.82,
  "plusBas": 46.06,
  "cloture": 46.8,
  "volume": 2141570,
  "moyennesMobiles": [
    46.8,
    46.68
  ]
};

export const LISTE_COURS_TICKER_ALLEGE: DTOCoursTickerAllege[] = [
  {
    "date": "2025-05-09",
    "cloture": 46.23,
    "volume": 2141570
  },
  {
    "date": "2025-05-08",
    "cloture": 45.7,
    "volume": 2047911
  }
];

export const COURS_CROISSANT: Cours = Cours.fromDTOCoursTicker("GLE", "Societe Generale",
  {
    "date": "2025-05-09",
    "ouverture": 46.23,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.8,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ]
  }, LISTE_COURS_TICKER_ALLEGE);

export const COURS_DECROISSANT: Cours = Cours.fromDTOCoursTicker("GLE", "Societe Generale",
  {
    "date": "2025-05-09",
    "ouverture": 46.8,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.23,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ]
  }, LISTE_COURS_TICKER_ALLEGE);

export const LISTE_COURS_AVEC_LISTE_ALLEGEE: DTOCoursAvecListeAllege[] = [
  {
    "date": "2025-05-09",
    "ticker": "GLE",
    "ouverture": 46.23,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.8,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ],
    "cours": LISTE_COURS_TICKER_ALLEGE
  }
];

export const COURS_PORTEFEUILLE = new CoursPortefeuille(VALEUR, LISTE_COURS_AVEC_LISTE_ALLEGEE[0], [], []);

export const FILTRES: DTOFiltre[] = [
  {
    "nom": "Remontée",
    "condition": "M20 > M10 && M10 > M5 && M5 < M1"
  },
  {
    "nom": "Chute",
    "condition": "M20 < M10 && M10 < M5 && M5 > M1"
  }
]
