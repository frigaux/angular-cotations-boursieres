import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';

export interface AlerteDecoree {
  alerte: DTOAlerte;
  evaluer: Function;
}
