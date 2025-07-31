import {DTOAchat} from '../../../../services/valeurs/dto-achat.interface';

export class AchatDecore {
  id: number;
  date: Date;
  achat: DTOAchat;

  constructor(id: number, date: Date, achat: DTOAchat) {
    this.id = id;
    this.date = date;
    this.achat = achat;
  }
}
