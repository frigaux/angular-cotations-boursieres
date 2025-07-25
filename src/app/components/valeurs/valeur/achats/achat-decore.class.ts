import {Achat} from '../../../../services/valeurs/achat.interface';

export class AchatDecore {
  id: number;
  achat: Achat;

  constructor(id: number, achat: Achat) {
    this.id = id;
    this.achat = achat;
  }
}
