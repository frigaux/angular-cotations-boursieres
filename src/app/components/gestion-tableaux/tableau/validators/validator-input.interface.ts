import {DTOColonne} from '../../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';

export interface ValidatorInput {
  colonnes: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>[];
  colonne: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>;
}
