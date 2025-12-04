import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {Logs} from '@tensorflow/tfjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {BarreProgressionComponent} from '../../commun/barre-progression/barre-progression.component';
import {JsonPipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-modele-apprentissage-automatique',
  imports: [
    TranslatePipe,
    Button,
    BarreProgressionComponent,
    JsonPipe,
    UIChart,
    Select,
    FormsModule,
    InputText
  ],
  templateUrl: './modele-apprentissage-automatique.component.html',
  styleUrl: './modele-apprentissage-automatique.component.sass',
})
export class ModeleApprentissageAutomatiqueComponent implements OnInit {
  // données pour la vue
  // liste déroulantes
  protected backends: Array<string> = ['cpu', 'webgl']; // 'tensorflow' (requires tfjs-node), 'wasm' (requires tfjs-backend-wasm).
  protected backend: string = this.backends[0];
  protected backendChangeAvecSucces?: boolean;
  protected epochsOptions: Array<number> = [50, 100, 250, 500];
  protected epochs: number = this.epochsOptions[0];

  protected progressionEntrainement: number = 0;
  protected model?: LayersModel;
  protected prediction?: any;

  // https://www.chartjs.org/
  protected dataLineChart?: any;
  protected dataLineOptions?: any;

  // private
  private tableauLogs: Array<Logs> = [];

  constructor(private translateService: TranslateService) {
    this.dataLineOptions = this.wrapDataLineOptions();
  }

  ngOnInit(): void {
    this.changeBackend();
  }

  protected changeBackend() {
    this.backendChangeAvecSucces = false;
    tf.setBackend(this.backend).then(success => {
      this.backendChangeAvecSucces = true;
    });
  }

  protected entrainerModele() {
    this._entrainerModele();
  }

  private _entrainerModele() {
    this.progressionEntrainement = 0;
    this.model = undefined;
    this.tableauLogs = [];

    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // tf.enableDebugMode();
    // console.log('model', model.summary());
    // console.log(xs.arraySync(), xs.dataSync());

    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    model.compile({optimizer: 'sgd', loss: 'meanSquaredError', metrics: ['accuracy']});

    model.fit(xs, ys, {
      epochs: this.epochs,
      batchSize: 300,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (logs) {
            this.tableauLogs.push(logs);
          }
          const pourcentage = Math.round(100 * epoch / this.epochs);
          if (!this.progressionEntrainement || pourcentage > this.progressionEntrainement) {
            this.progressionEntrainement = pourcentage;
          }
        }
      }
    }).then(() => {
      this.model = model;
      this.dataLineChart = this.wrapDataLineChart();
    });
  }

  protected predireAvecLeModele() {
    const prediction: any = this.model!.predict(tf.tensor2d([5], [1, 1]));
    prediction.array().then((array: any) => this.prediction = array);
  }

  private wrapDataLineOptions() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('COMPOSANTS.PARAMETRAGE.MODELE_APPRENTISSAGE_AUTOMATIQUE.LINE_CHART.EPOCH')
          }
        }
      }
    };
  }

  private wrapDataLineChart() {
    return {
      labels: this.tableauLogs.map((value, index) => String(index)),
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.PARAMETRAGE.MODELE_APPRENTISSAGE_AUTOMATIQUE.LINE_CHART.LOSS'),
          data: this.tableauLogs.map(logs => logs['loss'] as number),
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        },
        {
          label: this.translateService.instant('COMPOSANTS.PARAMETRAGE.MODELE_APPRENTISSAGE_AUTOMATIQUE.LINE_CHART.VAL_LOSS'),
          data: this.tableauLogs.map(logs => logs['val_loss'] as number),
          tension: 0.4,
          hidden: true
        },
        {
          label: this.translateService.instant('COMPOSANTS.PARAMETRAGE.MODELE_APPRENTISSAGE_AUTOMATIQUE.LINE_CHART.ACC'),
          data: this.tableauLogs.map(logs => logs['acc'] as number),
          tension: 0.4,
          hidden: true
        },
        {
          label: this.translateService.instant('COMPOSANTS.PARAMETRAGE.MODELE_APPRENTISSAGE_AUTOMATIQUE.LINE_CHART.VAL_ACC'),
          data: this.tableauLogs.map(logs => logs['val_acc'] as number),
          tension: 0.4,
          hidden: true
        }
      ]
    };
  }
}
