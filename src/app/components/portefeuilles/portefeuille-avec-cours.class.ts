import {Portefeuille} from './gestion-portefeuilles/portefeuille.interface';

export class PortefeuilleAvecCours {
  portefeuille: Portefeuille;

  constructor(portefeuille: Portefeuille) {
    this.portefeuille = portefeuille;
  }
}
