import {DTOOrdre} from './dto-ordre.interface';
import {DTOInformation} from './dto-information.interface';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';

export interface DTOCotationsTickerBoursorama {
  coursPortefeuille: CoursPortefeuille;
  cours: number;
  ouverture: number;
  clotureVeille: number;
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
