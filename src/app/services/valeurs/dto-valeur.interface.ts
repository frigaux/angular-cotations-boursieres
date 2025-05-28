import {Marche} from './marche.enum';

export interface DTOValeur {
  ticker: string;
  marche: Marche;
  libelle: string;
}
