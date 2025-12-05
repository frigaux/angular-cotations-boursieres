import {Injectable} from '@angular/core';
import {Tensor} from '@tensorflow/tfjs-core';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {
  donneesFonctionAffine(): { x: Tensor, y: Tensor } {
    // console.log(xs.arraySync(), xs.dataSync());

    return {
      x: tf.tensor([-1, 0, 1, 2, 3, 4], [6, 1], 'int32'),
      y: tf.tensor([-3, -1, 1, 3, 5, 7], [6, 1], 'int32')
    };
  }
}
