import {Achat} from '../../../../services/valeurs/achat.interface';

export class AchatDecore {
  id: number;
  date: Date;
  achat: Achat;

  constructor(id: number, date: Date, achat: Achat) {
    this.id = id;
    this.date = date;
    this.achat = achat;
  }
}
