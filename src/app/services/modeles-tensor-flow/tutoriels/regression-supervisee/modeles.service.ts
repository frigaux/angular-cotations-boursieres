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
  modeleFonctionAffine(parametresModele: ParametresModele): LayersModel {
    // Modèle séquentiel
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [1], units: 1}));

    // Modèle fonctionnel : un neurone avec les deux paramètres poids et biais
    // f(x)=ax+b avec a le poids et b le biais
    const entree: SymbolicTensor = tf.input({shape: [1]});
    const dense: SymbolicTensor = tf.layers.dense({units: 1, useBias: true}).apply(entree) as SymbolicTensor;
    const model = tf.model({inputs: entree, outputs: dense});

    const loss = parametresModele.fonctionsPertes.map(fonction => (tf.losses as any)[fonction]);
    const metrics = parametresModele.metriques.map(metrique => (tf.metrics as any)[metrique]);
    model.compile({
      optimizer: (tf.train as any)[parametresModele.optimiseur](parametresModele.tauxApprentissage),
      loss,
      metrics
    });

    return model;
  }

  modelePuissancesRendements(parametresModele: ParametresModele): LayersModel {
    // Modèle séquentiel
    // const model = tf.sequential();
    // model.add(tf.layers.dense({inputShape: [1], units: 1, useBias: true}));
    // model.add(tf.layers.dense({units: 1, useBias: true}));

    // Modèle fonctionnel
    const entree: SymbolicTensor = tf.input({shape: [1]});
    const dense1: SymbolicTensor = tf.layers.dense({units: 1, activation: 'sigmoid', useBias: true}).apply(entree) as SymbolicTensor;
    const dense2: SymbolicTensor = tf.layers.dense({units: 5, activation: 'sigmoid', useBias: true}).apply(dense1) as SymbolicTensor;
    const dense3: SymbolicTensor = tf.layers.dense({units: 1, useBias: true}).apply(dense2) as SymbolicTensor;
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
