import {DTOOrdre} from './dto-ordre.interface';
import {DTOInformation} from './dto-information.interface';
import {DTOCotations} from './dto-cotations.interface';
import {DTOValeur} from './dto-valeur.interface';
import {DtoTransaction} from './dto-transaction.interface';
import {DTOHistoriqueJour} from './dto-historique-jour.interface';
import {DTOHistoriquePeriode} from './dto-historique-periode.interface';
import {DTORisqueESG} from './dto-risque-esg.interface';
import {DTOConsensus} from './dto-consensus.interface';

export interface DTOInformationsTickerBoursorama {
  valeur: DTOValeur;
  cotations: DTOCotations;
  achats: Array<DTOOrdre>;
  ventes: Array<DTOOrdre>;
  actualites: Array<DTOInformation>;
  analyses: Array<DTOInformation>;
  cours: Array<{ label: string, data: number }>;
  transactions: Array<DtoTransaction>;
  historiqueJours: Array<DTOHistoriqueJour>;
  historiquePeriodes: Array<DTOHistoriquePeriode>;
  risqueESG: DTORisqueESG;
  consensus?: DTOConsensus;
  evenements: Array<DTOInformation>;
  communiques: Array<DTOInformation>;
}
