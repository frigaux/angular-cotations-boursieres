import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {DTOModele} from '../../../../services/modeles-tensor-flow/dto-modele.interface';
import {Tensor} from '@tensorflow/tfjs-core';

export interface ModeleEtDonnees {
  modeleCouches: LayersModel;
  modele: DTOModele;
  entrees: Tensor;
  sorties: Tensor;
}
