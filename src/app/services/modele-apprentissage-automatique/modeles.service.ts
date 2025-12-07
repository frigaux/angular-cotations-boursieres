import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import * as tf from '@tensorflow/tfjs';
import {SymbolicTensor} from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  modeleFonctionAffine(tauxApprentissage: number): LayersModel {
    // Modèle séquentiel : y = 2x - 1
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [1], units: 1}));

    // Modèle fonctionnel : y = 2x - 1
    const input: SymbolicTensor = tf.input({shape: [1]});
    const dense: SymbolicTensor = tf.layers.dense({units: 1}).apply(input) as SymbolicTensor;
    const model = tf.model({inputs: input, outputs: dense});

    model.compile({
      optimizer: tf.train.sgd(tauxApprentissage),
      loss: tf.losses.meanSquaredError,
      metrics: ['accuracy']
    });

    return model;
  }

  modelePuissanceRendement(tauxApprentissage: number): LayersModel {
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    // model.add(tf.layers.dense({units: 1, useBias: true}));

    const input: SymbolicTensor = tf.input({shape: [1]});
    const dense1: SymbolicTensor = tf.layers.dense({units: 1, useBias: true}).apply(input) as SymbolicTensor;
    const dense2: SymbolicTensor = tf.layers.dense({units: 1, useBias: true}).apply(dense1) as SymbolicTensor;
    const model = tf.model({inputs: input, outputs: dense2});

    model.compile({
      optimizer: tf.train.adam(tauxApprentissage),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse'],
    });

    return model;
  }
}
