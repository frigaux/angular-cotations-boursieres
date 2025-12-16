import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {
  DonneesNormalisees
} from '../../../../services/modeles-tensor-flow/regression-supervisee/donnees-normalisees.interface';

export interface ModeleEtDonnees {
  modele: LayersModel;
  donneesNormalisees: DonneesNormalisees;
}
