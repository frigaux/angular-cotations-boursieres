import {Injectable} from '@angular/core';
import {Tensor} from '@tensorflow/tfjs-core';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {
  donneesFonctionAffine(): Promise<{ entrees: Tensor; sorties: Tensor; }> {
    return new Promise(resolve => resolve({
      entrees: tf.tensor([-1, 0, 1, 2, 3, 4], [6, 1], 'int32'),
      sorties: tf.tensor([-3, -1, 1, 3, 5, 7], [6, 1], 'int32')
    }));
  }

  async donneesPuissanceConso(): Promise<{ entrees: Tensor; sorties: Tensor; }> {
    const reponse = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const voitures: Array<any> = await reponse.json();
    const voituresValides = voitures
      .filter(car => (car.Miles_per_Gallon != null && car.Horsepower != null));
    const puissances = voituresValides.map(car => car.Horsepower);
    const consommations = voituresValides.map(car => car.Miles_per_Gallon);
    return {
      entrees: tf.tensor2d(puissances, [puissances.length, 1]),
      sorties: tf.tensor2d(consommations, [consommations.length, 1])
    };
  }
}
