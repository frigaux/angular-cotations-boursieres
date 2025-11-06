import {DTOColonne} from '../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../services/tableaux/types-colonnes-portefeuille.enum';

export class ColonneDecoree {
  id: number;
  colonne: DTOColonne<TypesColonnesPortefeuille>;
  evaluer: Function;
  textAlign: 'right' | 'center' | 'left';

  constructor(id: number, colonne: DTOColonne<TypesColonnesPortefeuille>, evaluer: Function) {
    this.id = id;
    this.colonne = colonne;
    this.evaluer = evaluer;
    if (colonne.type === TypesColonnesPortefeuille.DATE ||
      colonne.type === TypesColonnesPortefeuille.MARCHE ||
      colonne.type === TypesColonnesPortefeuille.TICKER ||
      colonne.type === TypesColonnesPortefeuille.LIBELLE ||
      colonne.type === TypesColonnesPortefeuille.ALERTES ||
      colonne.type === TypesColonnesPortefeuille.DIVIDENDES) {
      this.textAlign = 'left';
    } else {
      this.textAlign = 'right';
    }
  }
}
