import {TypeColonnePortefeuille} from './type-colonne-portefeuille.enum';
import {TypeColonneCours} from './type-colonne-cours.enum';

export interface DTOColonne<T extends TypeColonnePortefeuille | TypeColonneCours> {
  nom: string;
  type: T;
  parametre?: number;
  tri: boolean;
  largeur: number;
}
