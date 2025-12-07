import {Tensor} from '@tensorflow/tfjs-core';

export interface Donnees {
  entrees: Tensor;
  sorties: Tensor;
}
