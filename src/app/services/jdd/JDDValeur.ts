import {Marche} from '../valeurs/marche';
import {DTOValeur} from '../valeurs/DTOValeur';

export const VALEUR: DTOValeur = {
  "ticker": "GLE",
  "marche": Marche.EURO_LIST_A,
  "libelle": "Societe Generale"
}

export const VALEURS: DTOValeur[] = [
  {
    "ticker": "GLE",
    "marche": Marche.EURO_LIST_A,
    "libelle": "Societe Generale"
  },
  {
    "ticker": "BNP",
    "marche": Marche.EURO_LIST_A,
    "libelle": "Bnp Paribas"
  }
];
