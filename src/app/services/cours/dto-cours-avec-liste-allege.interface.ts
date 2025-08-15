import {DTOCoursTickerAllege} from './dto-cours-ticker-allege.interface';

export interface DTOCoursAvecListeAllege {
  date: string; // ISO 8601 : yyyy-MM-dd
  ticker: string;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  cours: DTOCoursTickerAllege[];
}
