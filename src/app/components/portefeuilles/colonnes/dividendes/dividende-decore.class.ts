import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';

export class DividendeDecore {
  id: number;
  dividende: DTODividende;
  pourcentageDividende: number;


  constructor(id: number, dividende: DTODividende, cloture: number) {
    this.id = id;
    this.dividende = dividende;
    this.pourcentageDividende = dividende.montant / cloture;
  }
}
