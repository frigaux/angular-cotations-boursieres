import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';

export class AchatDecore {
  id: number;
  form: { date: Date, dateRevente?: Date, revendu: boolean };
  achat: DTOAchat;
  cours?: number;
  variationAchat?: number;
  variationBas?: number;
  variationHaut?: number;

  constructor(id: number, achat: DTOAchat) {
    this.id = id;
    this.form = {
      date: new Date(achat.date),
      dateRevente: achat.dateRevente ? new Date(achat.dateRevente) : undefined,
      revendu: achat.dateRevente !== undefined
    };
    this.achat = achat;
  }
}
