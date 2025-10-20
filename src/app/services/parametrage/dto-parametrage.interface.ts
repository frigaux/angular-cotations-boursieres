import {DTOAchatsTicker} from '../valeurs/dto-achats-ticker.interface';
import {DTOFiltre} from '../cours/dto-filtre.interface';
import {DTOPortefeuille} from '../portefeuilles/dto-portefeuille.interface';
import {DTOTableaux} from '../tableaux/dto-tableaux.interface';

export interface DTOParametrage {
  achats: Array<DTOAchatsTicker>;
  filtres: Array<DTOFiltre>;
  portefeuilles: Array<DTOPortefeuille>;
  tableaux: DTOTableaux;
}
