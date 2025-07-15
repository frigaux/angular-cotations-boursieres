import {DTOColonnePortefeuille} from './dto-colonne-portefeuille.interface';

export interface DTOTableauPortefeuille {
  colonnesPaysage: DTOColonnePortefeuille[];
  colonnesPortrait: DTOColonnePortefeuille[];
}
