import {DTOOrdre} from './dto-ordre.interface';

export interface DtoInformationsTickerBoursorama {
  cours: number;
  ouverture: number;
  cloture: number;
  plusHaut: number;
  plusBas: number;
  volume: number;
  pourcentageCapitalEchange: number;

  valorisation: number;
  limiteBaisse: number;
  limiteHausse: number;
  pourcentageRendementEstime: number;
  perEstime: number;
  dernierDividende: number;
  dateDernierDividende: number;
  risqueESG: string;

  achats: Array<DTOOrdre>;
  ventes: Array<DTOOrdre>;
}
