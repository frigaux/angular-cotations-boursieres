import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';

export class DividendeDecore {
  id: number;
  dividende: DTODividende;


  constructor(id: number, dividende: DTODividende) {
    this.id = id;
    this.dividende = dividende;
  }
}
