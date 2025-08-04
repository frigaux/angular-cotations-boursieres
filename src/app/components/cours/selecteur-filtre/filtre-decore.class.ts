import {DTOFiltre} from '../../../services/cours/dto-filtre.interface';

export class FiltreDecore {
  id: number;
  filtre: DTOFiltre;

  constructor(id: number, filtre: DTOFiltre) {
    this.id = id;
    this.filtre = filtre;
  }
}
