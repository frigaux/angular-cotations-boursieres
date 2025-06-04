import {Portefeuille} from './gestion-portefeuilles/portefeuille.interface';
import {CoursPortefeuille} from './cours-portefeuille.class';

export class PortefeuilleAvecCours {
  portefeuille: Portefeuille;
  cours: Array<CoursPortefeuille> = [];

  constructor(portefeuille: Portefeuille) {
    this.portefeuille = portefeuille;
  }
}
