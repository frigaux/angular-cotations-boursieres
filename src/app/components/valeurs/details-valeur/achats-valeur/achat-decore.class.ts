import {DTOAchat} from '../../../../services/valeurs/dto-achat.interface';

export class AchatDecore {
  id: number;
  date: Date;
  achat: DTOAchat;
  cours?: number;
  variationAchat?: number;
  variationBas?: number;
  variationHaut?: number;

  constructor(id: number, date: Date, achat: DTOAchat) {
    this.id = id;
    this.date = date;
    this.achat = achat;
  }
}
