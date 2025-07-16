import {DTOColonne} from './dto-colonne-portefeuille.interface';
import {TypeColonnePortefeuille} from './type-colonne-portefeuille.enum';

export interface DTOTableau<T extends TypeColonnePortefeuille> {
  colonnesPaysage: DTOColonne<T>[];
  colonnesPortrait: DTOColonne<T>[];
}
