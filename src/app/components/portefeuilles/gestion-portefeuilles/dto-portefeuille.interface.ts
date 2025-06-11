import {DTOAlerte} from './dto-alerte.interface';

export interface DTOPortefeuille {
  nom: string;
  parDefaut: boolean;
  tickers: string[];
  alertes: DTOAlerte[];
}
