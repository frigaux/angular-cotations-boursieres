import {Tensor} from '@tensorflow/tfjs-core';
import {Rank} from '@tensorflow/tfjs';

export interface DonneesNormalisees {
  entrees: Tensor;
  sorties: Tensor;
  entreesMin: Tensor<Rank>;
  entreesMax: Tensor<Rank>;
  sortiesMin: Tensor<Rank>;
  sortiesMax: Tensor<Rank>;
}
