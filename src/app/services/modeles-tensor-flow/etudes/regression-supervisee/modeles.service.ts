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
    const reshape: SymbolicTensor = tf.layers.reshape({targetShape: [inputShape, 1]}).apply(entree) as SymbolicTensor;
    const conv1d_1: SymbolicTensor = tf.layers.conv1d({
      kernelSize: 5,
      filters: 32,
      strides: 1,
      activation: 'linear',
      kernelInitializer: 'varianceScaling'
    }).apply(reshape) as SymbolicTensor;
    const maxPooling1d_1: SymbolicTensor = tf.layers.maxPooling1d({poolSize: 2, strides: 2}).apply(conv1d_1) as SymbolicTensor;
    const conv1d_2: SymbolicTensor = tf.layers.conv1d({
      kernelSize: 5,
      filters: 64,
      strides: 1,
      activation: 'linear',
      kernelInitializer: 'varianceScaling'
    }).apply(maxPooling1d_1) as SymbolicTensor;
    const maxPooling1d_2: SymbolicTensor = tf.layers.maxPooling1d({poolSize: 2, strides: 2}).apply(conv1d_2) as SymbolicTensor;
    const flatten: SymbolicTensor = tf.layers.flatten().apply(maxPooling1d_2) as SymbolicTensor;
    const dense1: SymbolicTensor = tf.layers.dense({units: 64, activation: 'linear'}).apply(flatten) as SymbolicTensor;
    const dense2: SymbolicTensor = tf.layers.dense({units: 1, activation: 'linear'}).apply(dense1) as SymbolicTensor;
    const model = tf.model({inputs: entree, outputs: dense2});

    // // Pour une approche convolutionnelle 1D, nous devons transformer l'entrée plate [inputShape] en [inputShape, 1]
    // const model = tf.sequential();
    //
    // // Redimensionnement de l'entrée : de [inputShape] à [inputShape, 1] (1 canal pour la série temporelle)
    // model.add(tf.layers.reshape({targetShape: [inputShape, 1], inputShape: [inputShape]}));
    //
    // // Première couche de convolution pour détecter les motifs locaux (vagues)
    // model.add(tf.layers.conv1d({
    //   kernelSize: 5,
    //   filters: 32,
    //   strides: 1,
    //   activation: 'linear',
    //   kernelInitializer: 'varianceScaling'
    // }));
    //
    // // Couche de MaxPooling pour réduire la dimension et extraire les caractéristiques dominantes
    // model.add(tf.layers.maxPooling1d({poolSize: 2, strides: 2}));
    //
    // // Deuxième couche de convolution pour des motifs plus globaux
    // model.add(tf.layers.conv1d({
    //   kernelSize: 5,
    //   filters: 64,
    //   strides: 1,
    //   activation: 'linear',
    //   kernelInitializer: 'varianceScaling'
    // }));
    //
    // // Deuxième MaxPooling
    // model.add(tf.layers.maxPooling1d({poolSize: 2, strides: 2}));
    //
    // // Aplatissement des données pour passer aux couches denses
    // model.add(tf.layers.flatten());
    //
    // // Couche dense pour l'interprétation des caractéristiques extraites
    // model.add(tf.layers.dense({units: 64, activation: 'linear'}));
    //
    // // Couche de sortie pour la régression (1 neurone, activation linéaire pour prédire le nombre)
    // model.add(tf.layers.dense({units: 1, activation: 'linear'}));

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
