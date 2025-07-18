import {TypesColonnesPortefeuille} from './types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from './types-colonnes-cours.enum';

export interface DTOColonne<T extends TypesColonnesPortefeuille | TypesColonnesCours> {
  nom: string;
  type: T;
  parametre?: number;
  tri: boolean;
  largeur: number;
  ordre: number;
}
