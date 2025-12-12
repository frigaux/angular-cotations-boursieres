import {Tensor} from '@tensorflow/tfjs-core';
import {Rank} from '@tensorflow/tfjs';

export interface Donnees<T extends Rank> {
  entrees: Tensor<T>;
  sorties: Tensor<T>;
}
