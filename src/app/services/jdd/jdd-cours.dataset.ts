import { DTOCoursTicker } from "../cours/dto-cours-ticker.interface";
import {DTOCoursTickerLight} from '../cours/dto-cours-ticker-light.interface';
import {DTOListeCours} from '../cours/dto-liste-cours.interface';
import {Cours} from '../../components/cours/cours.class';

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
