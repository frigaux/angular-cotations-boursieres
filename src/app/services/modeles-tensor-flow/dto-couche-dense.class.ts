import {DTONeurone} from './dto-neurone.interface';
import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';

export class DTOCoucheDense implements DTOCouche {
  readonly type: TypeCouche = TypeCouche.DENSE;
  numero: number;
  fonctionActivation: string;
  fonctionInitialisationPoids: string;
  neurones: DTONeurone[];

  constructor(numero: number, fonctionActivation: string, fonctionInitialisationPoids: string, neurones: DTONeurone[]) {
    this.numero = numero;
    this.fonctionActivation = fonctionActivation;
    this.fonctionInitialisationPoids = fonctionInitialisationPoids;
    this.neurones = neurones;
  }
}
