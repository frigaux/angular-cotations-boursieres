import {TypeColonnePortefeuille} from './type-colonne-portefeuille.enum';

export interface DTOColonnePortefeuille {
  nom: string;
  type: TypeColonnePortefeuille;
  parametre?: number;
  tri: boolean;
  largeur: number;
}
