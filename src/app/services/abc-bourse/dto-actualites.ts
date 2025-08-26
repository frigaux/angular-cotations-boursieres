import {DTOLien} from './dto-lien.class';
import {DTOVentesADecouvert} from './dto-ventes-a-decouvert.class';
import {DTOTransaction} from './dto-transaction.class';

export class DTOActualites {
  marches?: string;
  analyses: Array<DTOLien>;
  chroniques: Array<DTOLien>;
  ventesADecouvert: Array<DTOVentesADecouvert>;
  transactionsDirigeants: Array<DTOTransaction>;

  constructor() {
    this.analyses = [];
    this.chroniques = [];
    this.ventesADecouvert = [];
    this.transactionsDirigeants = [];
  }
}
