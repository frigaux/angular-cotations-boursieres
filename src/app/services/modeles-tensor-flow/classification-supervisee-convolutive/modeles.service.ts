import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {DonneesService} from './donnees.service';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  modeleImagesChiffres(tauxApprentissage: number) {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
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

    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dense({
      units: DonneesService.CHIFFRES_DISTINCTS,
      kernelInitializer: 'varianceScaling',
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(tauxApprentissage),
      loss: tf.losses.softmaxCrossEntropy,
      metrics: [tf.metrics.binaryAccuracy]
    });

    return model;
  }
}
