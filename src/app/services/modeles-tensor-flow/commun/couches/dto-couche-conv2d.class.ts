import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';
import {DTONeurone2d} from './dto-neurone2d.interface';

export class DTOCoucheConv2d implements DTOCouche {
  readonly type: TypeCouche = TypeCouche.CONV2D;
  numero: number;
  fonctionActivation: string;
  fonctionInitialisationPoids: string;
  neurones: DTONeurone2d[];
  pas: number[];

  constructor(numero: number, fonctionActivation: string, fonctionInitialisationPoids: string, neurones: DTONeurone2d[], pas: number[]) {
    this.numero = numero;
    this.fonctionActivation = fonctionActivation;
    this.fonctionInitialisationPoids = fonctionInitialisationPoids;
    this.neurones = neurones;
    this.pas = pas;
  }
}
