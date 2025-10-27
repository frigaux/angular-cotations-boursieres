import {DTOOrdre} from './dto-ordre.interface';

export interface DTOCotationsTickerBoursorama {
  cours: number;
  ouverture: number;
  cloture: number;
  plusHaut: number;
  plusBas: number;
  volume: number;

  pourcentageCapitalEchange: number;
  valorisation: string;
  limiteBaisse: number;
  limiteHausse: number;
  pourcentageRendementEstime: number;
  perEstime: number;
  dernierDividende: number;
  dateDernierDividende: string; // ISO 8601 : yyyy-MM-dd
  risqueESG: string;

  achats: Array<DTOOrdre>;
  ventes: Array<DTOOrdre>;
}
