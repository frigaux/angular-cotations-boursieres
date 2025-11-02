import {DTODividende} from './dto-dividende.interface';

export class DTODividendes {
  dateRecuperation: string; // ISO 8601 : yyyy-MM-dd
  dividendes: Array<DTODividende>;

  constructor() {
    this.dateRecuperation = new Date().toISOString().substring(0, 10);
    this.dividendes = [];
  }
}
