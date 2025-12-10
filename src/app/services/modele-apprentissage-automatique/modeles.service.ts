import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import * as tf from '@tensorflow/tfjs';
import {SymbolicTensor} from '@tensorflow/tfjs';
import {CoucheDense} from './couche-dense.interface';
import {Neurone} from './neurone';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  couchesDense(modele: LayersModel): Array<CoucheDense> {
    return modele.layers
      .filter((layer: any) => layer.getClassName?.() === 'Dense')
      .map((layer: any) => {
        const [kernel, bias] = layer.getWeights();
        const poidsNeurones = kernel.arraySync() as number[][];
        const biais = bias.arraySync() as number[];
        const neurones: Array<Neurone> = Array.from({length: biais.length}, (v, idxBiais) => {
          return {
            poids: Array.from({length: poidsNeurones.length}, (v, i) => poidsNeurones[i][idxBiais]),
            biais: biais[idxBiais]
          };
        });
        return {
          numero: layer.id,
          fonctionActivation: layer.activation.getClassName?.(),
          neurones
        };
      });
  }

  modeleFonctionAffine(tauxApprentissage: number): LayersModel {
    // Modèle séquentiel
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [1], units: 1}));

    // Modèle fonctionnel : un neurone avec les deux paramètres poids et biais
    // f(x)=ax+b avec a le poids et b le biais
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
    const hidden: SymbolicTensor = tf.layers.dense({units: 5, activation: 'sigmoid'}).apply(dense1) as SymbolicTensor;
    const dense2: SymbolicTensor = tf.layers.dense({units: 1, useBias: true}).apply(hidden) as SymbolicTensor;
    const model = tf.model({inputs: input, outputs: dense2});

    model.compile({
      optimizer: tf.train.adam(tauxApprentissage),
      loss: tf.losses.meanSquaredError,
      metrics: ['accuracy'],
    });

    return model;
  }
}
