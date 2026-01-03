import {Injectable} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {Tensor1D} from '@tensorflow/tfjs';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {Donnees} from './donnees.interface';
import {DonneesNormalisees} from './donnees-normalisees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {

  donneesFonctionAffine(): Promise<Donnees<Rank.R2>> {
    // données sous la forme de la fonction affine, y = 2x - 1
    // Après entrainement, on trouve donc un neurone avec les deux paramètres :
    // poids = 2 et biais = -1 (si on ne normalise pas les entrées/sorties !)
    return new Promise(resolve => resolve({
      entrees: tf.tensor([1, 2, 3, 4, 5, 6, 7], [7, 1], 'int32'),
      sorties: tf.tensor([1, 3, 5, 7, 9, 11, 13], [7, 1], 'int32')
    }));
  }

  predictionsFonctionAffine(modele: LayersModel, donneesNormalisees: DonneesNormalisees) {
    const xs: Tensor1D = tf.linspace(0, 10, 100);
    const preds: any = modele.predict(xs.reshape([100, 1]));
    const entrees = xs
      .mul(donneesNormalisees.entreesMax.sub(donneesNormalisees.entreesMin))
      .add(donneesNormalisees.entreesMin);

    const sorties = preds
      .mul(donneesNormalisees.sortiesMax.sub(donneesNormalisees.sortiesMin))
      .add(donneesNormalisees.sortiesMin);
    return {entrees, sorties};
  }

  async donneesPuissancesRendements(): Promise<Donnees<Rank.R2>> {
    const reponse = await fetch('http://fabienrigaux.freeboxos.fr/ml/carsData.json');
    const voitures: Array<any> = await reponse.json();
    const voituresValides = voitures
      .filter(car => (car.Miles_per_Gallon != null && car.Horsepower != null));
    return tf.tidy(() => {
      tf.util.shuffle(voituresValides);
      const puissances = voituresValides.map(car => car.Horsepower);
      const consommations = voituresValides.map(car => car.Miles_per_Gallon);
      return {
        entrees: tf.tensor2d(puissances, [puissances.length, 1]),
        sorties: tf.tensor2d(consommations, [consommations.length, 1])
      };
    });
  }

  predictionsPuissancesRendements(modele: LayersModel, donneesNormalisees: DonneesNormalisees) {
    const xs: Tensor1D = tf.linspace(0, 1, 100);
    const preds: any = modele.predict(xs.reshape([100, 1]));
    const entrees = xs
      .mul(donneesNormalisees.entreesMax.sub(donneesNormalisees.entreesMin))
      .add(donneesNormalisees.entreesMin);

    const sorties = preds
      .mul(donneesNormalisees.sortiesMax.sub(donneesNormalisees.sortiesMin))
      .add(donneesNormalisees.sortiesMin);
    return {entrees, sorties};
  }
}
