import {Component} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';

@Component({
  selector: 'app-modele-apprentissage-automatique',
  imports: [
    TranslatePipe,
    Button
  ],
  templateUrl: './modele-apprentissage-automatique.component.html',
  styleUrl: './modele-apprentissage-automatique.component.sass',
})
export class ModeleApprentissageAutomatiqueComponent {
  protected model?: LayersModel;
  protected prediction?: any;

  protected entrainerModele() {
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

    // Generate some synthetic data for training.
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    console.log(xs, ys);

    // Train the model using the data.
    model.fit(xs, ys).then(() => {
      this.model = model;
    });
  }

  protected predireAvecLeModele() {
    // Use the model to do inference on a data point the model hasn't seen before:
    this.prediction = this.model!.predict(tf.tensor2d([5], [1, 1]));
  }
}
