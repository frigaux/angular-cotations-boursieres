import {TypeColonnePortefeuille} from './type-colonne-portefeuille.enum';

export interface DTOColonne<T extends TypeColonnePortefeuille> {
  nom: string;
  type: T;
  parametre?: number;
  tri: boolean;
  largeur: number;
}
