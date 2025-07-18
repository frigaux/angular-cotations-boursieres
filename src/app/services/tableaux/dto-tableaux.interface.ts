import {DTOTableau} from './dto-tableau-portefeuille.interface';
import {TypesColonnesPortefeuille} from './types-colonnes-portefeuille.enum';

export interface DTOTableaux {
  portefeuille: DTOTableau<TypesColonnesPortefeuille>;
}
