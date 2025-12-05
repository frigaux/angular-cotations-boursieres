import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import * as tf from '@tensorflow/tfjs';
import {SymbolicTensor} from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  modeleFonctionAffine(): LayersModel {
    // Modèle séquentiel : y = 2x - 1
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [1], units: 1}));

    // Modèle fonctionnel : y = 2x - 1
    const input: SymbolicTensor = tf.input({shape: [1]});
    const dense: SymbolicTensor = tf.layers.dense({units: 1}).apply(input) as SymbolicTensor;
    const model = tf.model({inputs: input, outputs: dense});

    // tf.enableDebugMode();
    // console.log('model', model.summary());

    model.compile({
      optimizer: 'sgd', // sgd ou adam
      loss: 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }
}
