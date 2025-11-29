import {Component} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-modele-apprentissage-automatique',
  imports: [
    TranslatePipe,
    Button,
    JsonPipe
  ],
  templateUrl: './modele-apprentissage-automatique.component.html',
  styleUrl: './modele-apprentissage-automatique.component.sass',
})
export class ModeleApprentissageAutomatiqueComponent {
  protected model?: LayersModel;
  protected prediction?: any;

  protected entrainerModele() {
    tf.setBackend('webgl').then(success => {
      console.log(`Backend ${tf.getBackend()} : ${success}`);
      if (success) {
        this._entrainerModele();
      }
    });
  }

  private _entrainerModele() {
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // tf.enableDebugMode();
    // console.log('model', model.summary());
    // console.log(xs.arraySync(), xs.dataSync());

    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    model.fit(xs, ys, {epochs: 500}).then(() => {
      this.model = model;
    });
  }

  protected predireAvecLeModele() {
    const prediction: any = this.model!.predict(tf.tensor2d([20], [1, 1]));
    prediction.array().then((array: any) => this.prediction = array);
  }
}
