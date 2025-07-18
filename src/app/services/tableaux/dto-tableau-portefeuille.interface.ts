import {DTOColonne} from './dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from './types-colonnes-portefeuille.enum';

export interface DTOTableau<T extends TypesColonnesPortefeuille> {
  colonnesPaysage: DTOColonne<T>[];
  colonnesPortrait: DTOColonne<T>[];
}
