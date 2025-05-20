import { DTOCoursTicker } from "../cours/DTOCoursTicker";
import {DTOCoursTickerLight} from '../cours/DTOCoursTickerLight';
import {DTOListeCours} from '../cours/DTOListeCours';
import {Cours} from '../../components/cours/Cours';

export const LISTE_COURS: DTOListeCours = {
  "date": new Date("2025-05-09"),
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
      ],
      "alerte": true
    }
  ]
};

export const COURS_TICKER: DTOCoursTicker = {
  "date": new Date("2025-05-09"),
  "ouverture": 46.23,
  "plusHaut": 46.82,
  "plusBas": 46.06,
  "cloture": 46.8,
  "volume": 2141570,
  "moyennesMobiles": [
    46.8,
    46.68
  ],
  "alerte": true
};

export const LISTE_COURS_TICKER_LIGHT: DTOCoursTickerLight[] = [
  {
    "date": new Date("2025-05-09"),
    "cloture": 46.23,
    "volume": 2141570,
    "alerte": true
  },
  {
    "date": new Date("2025-05-08"),
    "cloture": 45.7,
    "volume": 2047911,
    "alerte": true
  }
];

export const COURS_CROISSANT: Cours = new Cours(new Date("2025-05-09"), "GLE", "Societe Generale",
  {
    "date": new Date("2025-05-09"),
    "ouverture": 46.23,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.8,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ],
    "alerte": true
  }
);

export const COURS_DECROISSANT: Cours = new Cours(new Date("2025-05-09"), "GLE", "Societe Generale",
  {
    "date": new Date("2025-05-09"),
    "ouverture": 46.8,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.23,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ],
    "alerte": true
  }
);
