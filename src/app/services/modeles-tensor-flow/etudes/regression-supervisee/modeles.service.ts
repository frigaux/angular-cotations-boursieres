import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import * as tf from '@tensorflow/tfjs';
import {SymbolicTensor} from '@tensorflow/tfjs';
import {
  ParametresModele
} from '../../../../components/parametrage/modeles-tensor-flow/commun/formulaire-modele/parametres-modele.interface';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  modeleCoursVagues(parametresModele: ParametresModele, inputShape: number): LayersModel {
    const entree: SymbolicTensor = tf.input({shape: [inputShape]});
    const dense1: SymbolicTensor = tf.layers.dense({units: 16, activation: "linear", useBias: true}).apply(entree) as SymbolicTensor;
    const dense2: SymbolicTensor = tf.layers.dense({units: 16, activation: "linear", useBias: true}).apply(dense1) as SymbolicTensor;
    const dense3: SymbolicTensor = tf.layers.dense({units: 1, activation: "linear", useBias: true}).apply(dense2) as SymbolicTensor;
    const model = tf.model({inputs: entree, outputs: dense3});

    const loss = parametresModele.fonctionsPertes.map(fonction => (tf.losses as any)[fonction]);
    const metrics = parametresModele.metriques.map(metrique => (tf.metrics as any)[metrique]);
    model.compile({
      optimizer: (tf.train as any)[parametresModele.optimiseur](parametresModele.tauxApprentissage),
      loss,
      metrics
    });

    return model;
  }
}
