import {DTOLien} from '../../../../services/abc-bourse/dto-lien.class';

export class LienDecore {
  id: number;
  lien: DTOLien;
  html?: string;

  constructor(id: number, lien: DTOLien) {
    this.id = id;
    this.lien = lien;
  }
}
