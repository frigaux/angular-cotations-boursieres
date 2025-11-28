import {TypesColonnesPortefeuille} from '../../../../services/tableaux/types-colonnes-portefeuille.enum';
import {TypesColonnesCours} from '../../../../services/tableaux/types-colonnes-cours.enum';

export class TypeColonne {
  type: TypesColonnesPortefeuille | TypesColonnesCours;
  libelle: string;

  constructor(type: TypesColonnesPortefeuille | TypesColonnesCours, libelle: string) {
    this.type = type;
    this.libelle = libelle;
  }
}
