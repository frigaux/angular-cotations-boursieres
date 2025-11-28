import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';
import {DTOColonne} from '../../../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypeColonne} from './type-colonne.class';

export class ColonneDecoree {
  id: number;
  colonne: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>;
  typesDisponibles: TypeColonne[];

  constructor(id: number, colonne: DTOColonne<TypesColonnesPortefeuille | TypesColonnesCours>, typesDisponibles: TypeColonne[]) {
    this.id = id;
    this.colonne = colonne;
    this.typesDisponibles = typesDisponibles;
  }
}
