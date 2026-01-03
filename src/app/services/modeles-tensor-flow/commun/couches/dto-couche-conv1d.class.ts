import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';
import {DTONeurone} from './dto-neurone.interface';

export class DTOCoucheConv1D implements DTOCouche {
  readonly type: TypeCouche = TypeCouche.CONV1D;
  numero: number;
  fonctionActivation: string;
  fonctionInitialisationPoids: string;
  neurones: DTONeurone[];
  pas: number[];

  constructor(numero: number, fonctionActivation: string, fonctionInitialisationPoids: string, neurones: DTONeurone[], pas: number[]) {
    this.numero = numero;
    this.fonctionActivation = fonctionActivation;
    this.fonctionInitialisationPoids = fonctionInitialisationPoids;
    this.neurones = neurones;
    this.pas = pas;
  }
}
