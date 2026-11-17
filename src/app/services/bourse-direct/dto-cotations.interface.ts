import {DTOCours} from './dto-cours.interface';

export interface DTOCotations {
  date: number; // Unix epoch time in second
  ticker: string;
  cours: number;
  derniereCloture: number;
  ouverture: number;
  plusBas: number;
  plusHaut: number;
  volume: number;
  nbEchanges: number;
  jour?: DTOCours[];
}
