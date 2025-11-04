import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {DTODividende} from '../../services/dividendes/dto-dividende.interface';

export interface DividendeDecore {
  dividende: DTODividende
  valeur?: DTOValeur;
}
