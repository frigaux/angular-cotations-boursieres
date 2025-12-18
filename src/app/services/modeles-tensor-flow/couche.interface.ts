import {TypeCouche} from './type-couche';
import {Neurone} from './neurone.interface';

export interface Couche {
  numero: number;
  type: TypeCouche;
  fonctionActivation?: string;
  fonctionInitialisationPoids?: string;
  neurones: Neurone[];
}
