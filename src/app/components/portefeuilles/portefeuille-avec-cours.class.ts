import {Portefeuille} from './gestion-portefeuilles/portefeuille.interface';
import {Cours} from './cours.class';

export class PortefeuilleAvecCours {
  portefeuille: Portefeuille;
  cours: Array<Cours> = [];

  constructor(portefeuille: Portefeuille) {
    this.portefeuille = portefeuille;
  }
}
