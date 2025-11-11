import {DTOOrdre} from './dto-ordre.interface';
import {DTOInformation} from './dto-information.interface';
import {DTOCotations} from './dto-cotations.interface';
import {DTOValeur} from './dto-valeur.interface';
import {DtoTransaction} from './dto-transaction.interface';
import {DTOHistoriqueJour} from './dto-historique-jour.interface';
import {DTOHistoriquePeriode} from './dto-historique-periode.interface';

export interface DTOInformationsTickerBoursorama {
  valeur: DTOValeur;
  cotations: DTOCotations;
  achats: Array<DTOOrdre>;
  ventes: Array<DTOOrdre>;
  actualites: Array<DTOInformation>;
  analyses: Array<DTOInformation>;
  chartData?: Object;
  transactions: Array<DtoTransaction>;
  historiqueJours: Array<DTOHistoriqueJour>;
  historiquePeriodes: Array<DTOHistoriquePeriode>;
}
