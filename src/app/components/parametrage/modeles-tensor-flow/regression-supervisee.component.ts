import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {Logs} from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {BarreProgressionComponent} from '../../commun/barre-progression/barre-progression.component';
import {UIChart} from 'primeng/chart';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ModelesService} from '../../../services/modele-apprentissage-automatique/modeles.service';
import {DonneesService} from '../../../services/modele-apprentissage-automatique/donnees.service';
import {GraphiquesService} from '../../../services/modele-apprentissage-automatique/graphiques.service';
import {FloatLabel} from 'primeng/floatlabel';
import {Donnees} from '../../../services/modele-apprentissage-automatique/donnees.interface';
import {DonneesNormalisees} from '../../../services/modele-apprentissage-automatique/donnees-normalisees.interface';
import {CoucheDense} from '../../../services/modele-apprentissage-automatique/couche-dense.interface';
import {CoucheDenseComponent} from './couches/couche-dense/couche-dense.component';

// TODO : fonction d'activation (sigmoid, relu)
// TODO : compilation du modèle : optimizer, loss
// TODO : metrics : loss, accuracy
@Component({
  selector: 'app-modele-apprentissage-automatique',
  imports: [
    TranslatePipe,
    Button,
    BarreProgressionComponent,
    UIChart,
    Select,
    FormsModule,
    InputText,
    FloatLabel,
    CoucheDenseComponent
  ],
  templateUrl: './regression-supervisee.component.html',
  styleUrl: './regression-supervisee.component.sass',
})
export class RegressionSuperviseeComponent implements OnInit {
  // données pour la vue
  protected nombreTenseurs?: number;

  // liste déroulantes
  protected backends: Array<string> = ['cpu', 'webgl']; // 'tensorflow' (requires tfjs-node), 'wasm' (requires tfjs-backend-wasm).
  protected backend: string = this.backends[0];
  protected backendChangeAvecSucces?: boolean;

  //
  protected tauxApprentissage: number = 0.1;
  protected iterations: number = 50;
  protected lot: number = 32;

  //
  protected progressionEntrainement: number = 0;
  protected donnees?: Donnees;
  protected modele?: LayersModel;
  protected couchesDenses?: Array<CoucheDense>;

  // https://www.chartjs.org/
  protected donneesChart?: any;
  protected donneesChartOptions?: any;
  protected entrainementChart?: any;
  protected entrainementChartOptions?: any;

  constructor(private graphiquesService: GraphiquesService,
              private modelesService: ModelesService,
              private donneesService: DonneesService) {
    this.donneesChartOptions = this.graphiquesService.donneesChartOptions();
    this.entrainementChartOptions = this.graphiquesService.entrainementChartOptions();
  }

  ngOnInit(): void {
    this.changeBackend();
    window.setInterval(() => this.nombreTenseurs = tf.memory().numTensors, 1000);
    this.donneesService.donneesPuissanceRendement()
      .then(donnees => {
        // console.log(this.donnees?.entrees.arraySync(), this.donnees?.entrees.dataSync());
        this.donnees = donnees;
        this.donneesChart = this.graphiquesService.donneesChart(donnees, 'DONNEES');
      });
  }

  protected changeBackend() {
    this.backendChangeAvecSucces = false;
    tf.setBackend(this.backend).then(success => {
      this.backendChangeAvecSucces = true;
    });
  }

  protected entrainerModele() {
    if (this.donnees) {
      this.modele = undefined;
      const modele: LayersModel = this.modelesService.modelePuissanceRendement(this.tauxApprentissage);

      const donneesNormalisees = this.donneesService.normaliserZeroAUn(this.donnees);
      this.progressionEntrainement = 0;
      const logs: Array<Logs> = [];
      modele.fit(donneesNormalisees.entrees, donneesNormalisees.sorties, {
        epochs: this.iterations,
        batchSize: this.lot,
        shuffle: true,
        // validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, log) => {
            if (log) {
              logs.push(log);
            }
            const pourcentage = Math.round(100 * epoch / this.iterations);
            if (!this.progressionEntrainement || pourcentage > this.progressionEntrainement) {
              this.progressionEntrainement = pourcentage;
            }
          }
        }
      }).then(() => {
        this.modele = modele;
        this.entrainementTermine(donneesNormalisees, logs);
      });
    }
  }

  private entrainementTermine(donneesNormalisees: DonneesNormalisees, logs: Array<Logs>) {
    // this.donnees.x.dispose();
    // this.donnees.y.dispose();
    // tf.enableDebugMode();
    // console.log('modele', this.modele!.summary());
    // this.modele!.weights.forEach(w => {
    //   console.log(w.name, w.shape);
    // });
    // this.modele!.layers.forEach(layer => {
    //   console.log(layer.name, layer.weights);
    // });
    // const o: any = tf.layers.activation({activation: 'linear'}).apply(this.donnees!.entrees);
    // o.print();

    this.couchesDenses = this.modelesService.couchesDenses(this.modele!);

    // line chart : affichage des metrics d'entrainement
    this.entrainementChart = this.graphiquesService.entrainementChart(logs);

    // scatter chart : données et prédictions
    const datasets = this.graphiquesService.donneesChart(this.donnees!, 'DONNEES');
    datasets.datasets.push(this.graphiquesService.donneesChart(
      this.donneesService.predictionsPuissanceRendement(this.modele!, donneesNormalisees)
      , 'PREDICTIONS').datasets[0]);
    this.donneesChart = datasets;
  }
}
