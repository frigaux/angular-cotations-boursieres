import {DTOTableau} from './dto-tableau-portefeuille.interface';
import {TypeColonnePortefeuille} from './type-colonne-portefeuille.enum';

export interface DTOTableaux {
  portefeuille: DTOTableau<TypeColonnePortefeuille>;
}
