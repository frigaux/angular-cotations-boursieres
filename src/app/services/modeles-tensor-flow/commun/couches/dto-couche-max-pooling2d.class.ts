import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';

export class DTOCoucheMaxPooling2D implements DTOCouche {
  readonly type: TypeCouche = TypeCouche.MAXPOOLING2D;
  numero: number;
  taille: [number, number];
  pas: [number, number];

  constructor(numero: number, taille: [number, number], pas: [number, number]) {
    this.numero = numero;
    this.taille = taille;
    this.pas = pas;
  }
}
