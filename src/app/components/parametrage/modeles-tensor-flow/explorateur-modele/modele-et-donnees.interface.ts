import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {Modele} from '../../../../services/modeles-tensor-flow/modele.interface';
import {Tensor} from '@tensorflow/tfjs-core';

export interface ModeleEtDonnees {
  modeleCouches: LayersModel;
  modele: Modele;
  entrees: Tensor;
  sorties: Tensor;
}
