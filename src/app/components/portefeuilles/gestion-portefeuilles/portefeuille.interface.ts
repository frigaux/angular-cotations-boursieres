import {Alerte} from './alerte.interface';

export interface Portefeuille {
  nom: string;
  parDefaut: boolean;
  tickers: string[];
  alertes: Alerte[];
}
