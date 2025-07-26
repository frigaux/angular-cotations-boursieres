import {Marches} from '../valeurs/marches.enum';
import {DTOValeur} from '../valeurs/dto-valeur.interface';
import {AchatsTicker} from '../valeurs/achats-ticker.interface';

export const VALEUR: DTOValeur = {
  "ticker": "GLE",
  "marche": Marches.EURO_LIST_A,
  "libelle": "Societe Generale"
};

export const VALEURS: DTOValeur[] = [
  {
    "ticker": "GLE",
    "marche": Marches.EURO_LIST_A,
    "libelle": "Societe Generale"
  },
  {
    "ticker": "BNP",
    "marche": Marches.EURO_LIST_A,
    "libelle": "Bnp Paribas"
  }
];

export const ACHATS: Array<AchatsTicker> = [
  {
    "ticker": "GLE",
    "achats":
      [
        {
          "date": "2025-05-09",
          "quantite": 10,
          "prix": 46.23,
          "revendu": false
        },
        {
          "date": "2025-05-08",
          "quantite": 20,
          "prix": 45.7,
          "revendu": false
        }
      ]
  },
  {
    "ticker": "BNP",
    "achats":
      [
        {
          "date": "2025-05-09",
          "quantite": 10,
          "prix": 70.87,
          "revendu": false
        }
      ]
  }];
