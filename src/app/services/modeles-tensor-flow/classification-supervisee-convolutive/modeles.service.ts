import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {SymbolicTensor} from '@tensorflow/tfjs';
import {DonneesService} from './donnees.service';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  modeleFonctionnelImagesChiffres(tauxApprentissage: number) {
    const input: SymbolicTensor = tf.input({shape: [
      DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
      DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
      DonneesService.CANAL_NOIR_BLANC
    ]});
    const conv2d_1: SymbolicTensor = tf.layers.conv2d({
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }).apply(input) as SymbolicTensor;

    const maxPooling2d_1: SymbolicTensor = tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}).apply(conv2d_1) as SymbolicTensor;

    const conv2d_2 : SymbolicTensor = tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }).apply(maxPooling2d_1) as SymbolicTensor;

    const maxPoolong2d_2: SymbolicTensor = tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}).apply(conv2d_2) as SymbolicTensor;

    const flatten: SymbolicTensor = tf.layers.flatten().apply(maxPoolong2d_2) as SymbolicTensor;

    const dense: SymbolicTensor = tf.layers.dense({
      units: DonneesService.CHIFFRES_DISTINCTS,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'}
    ).apply(flatten) as SymbolicTensor;

    const modele = tf.model({inputs: input, outputs: dense});

    modele.compile({
      optimizer: tf.train.adam(tauxApprentissage),
      loss: tf.metrics.categoricalCrossentropy,
      metrics: [tf.metrics.categoricalAccuracy],
    });

    return modele;
  }

  modeleSequentielImagesChiffres(tauxApprentissage: number) {
    const modele = tf.sequential();

    modele.add(tf.layers.conv2d({
      inputShape: [
        DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
        DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
        DonneesService.CANAL_NOIR_BLANC
      ],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));

    modele.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    modele.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));
    modele.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    modele.add(tf.layers.flatten());

    modele.add(tf.layers.dense({
      units: DonneesService.CHIFFRES_DISTINCTS,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }));

    modele.compile({
      optimizer: tf.train.adam(tauxApprentissage),
      loss: tf.metrics.categoricalCrossentropy,
      metrics: [tf.metrics.categoricalAccuracy],
    });

    return modele;
  }
}
