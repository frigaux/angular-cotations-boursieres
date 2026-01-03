import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';
import {Shape} from '@tensorflow/tfjs-layers/dist/keras_format/common';

export class DTOCoucheReshape implements DTOCouche {
  readonly type: TypeCouche = TypeCouche.RESHAPE;
  numero: number;
  formeDestination: Shape;

  constructor(numero: number, formeDestination: Shape) {
    this.numero = numero;
    this.formeDestination = formeDestination;
  }
}
