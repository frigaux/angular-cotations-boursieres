import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {DonneesService} from './donnees.service';

@Injectable({
  providedIn: 'root',
})
export class ModelesService {
  modeleImagesChiffres() {
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

    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam();
    model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    return model;
  }
}
