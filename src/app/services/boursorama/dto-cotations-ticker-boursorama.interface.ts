import {DTOOrdre} from './dto-ordre.interface';
import {DTOInformation} from './dto-information.interface';

export interface DTOCotationsTickerBoursorama {
  ticker: string;
  libelle: string;
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
  actualites: Array<DTOInformation>;
  analyses: Array<DTOInformation>;
}
