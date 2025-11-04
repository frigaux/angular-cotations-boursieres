import {DTOAchatsTicker} from '../valeurs/dto-achats-ticker.interface';
import {DTOFiltre} from '../cours/dto-filtre.interface';
import {DTOPortefeuille} from '../portefeuilles/dto-portefeuille.interface';
import {DTOTableaux} from '../tableaux/dto-tableaux.interface';
import {DTODividendes} from '../dividendes/dto-dividendes.class';

export interface DTOParametrage {
  achats: Array<DTOAchatsTicker>;
  filtres: Array<DTOFiltre>;
  portefeuilles: Array<DTOPortefeuille>;
  tableaux: DTOTableaux;
  dividendes?: DTODividendes;
}
