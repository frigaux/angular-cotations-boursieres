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
import {ModelesService} from '../../../services/modeles-tensor-flow/regression-supervisee/modeles.service';
import {DonneesService} from '../../../services/modeles-tensor-flow/regression-supervisee/donnees.service';
import {GraphiquesService} from '../../../services/modeles-tensor-flow/regression-supervisee/graphiques.service';
import {FloatLabel} from 'primeng/floatlabel';
import {Donnees} from '../../../services/modeles-tensor-flow/regression-supervisee/donnees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';
import {ExplorateurModeleComponent} from './explorateur-modele/explorateur-modele.component';
import {ModeleEtDonnees} from './explorateur-modele/modele-et-donnees.interface';

@Component({
  selector: 'app-regression-supervisee',
  imports: [
    TranslatePipe,
    Button,
    BarreProgressionComponent,
    UIChart,
    Select,
    FormsModule,
    InputText,
    FloatLabel,
    ExplorateurModeleComponent
  ],
  templateUrl: './regression-supervisee.component.html',
  styleUrl: './regression-supervisee.component.sass',
})
export class RegressionSuperviseeComponent implements OnInit {
  // nombre de tenseur en mémoire
  protected nombreTenseurs?: number;

  // choix backend
  protected backends: Array<string> = ['cpu', 'webgl']; // 'tensorflow' (requires tfjs-node), 'wasm' (requires tfjs-backend-wasm).
  protected backend: string = this.backends[0];
  protected backendChangeAvecSucces?: boolean;

  // données, modèle, couches
  protected donnees?: Donnees<Rank.R2>;
  protected progressionEntrainement: number = 0;
  protected modeleEtDonnees?: ModeleEtDonnees;

  // paramètres apprentissage
  protected tauxApprentissage: number = 0.1;
  protected iterations: number = 50;
  protected lot: number = 32;

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
    this.donneesService.donneesPuissancesRendements()
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
      this.modeleEtDonnees = undefined;
      const modele: LayersModel = this.modelesService.modelePuissancesRendements(this.tauxApprentissage);

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
        this.modeleEtDonnees = {modele, donneesNormalisees};
        this.entrainementTermine(logs);
      });
    }
  }

  private entrainementTermine(logs: Array<Logs>) {
    this.tracerInformations();

    // line chart : affichage des metrics d'entrainement
    this.entrainementChart = this.graphiquesService.entrainementChart(logs);

    // scatter chart : données et prédictions
    const datasets = this.graphiquesService.donneesChart(this.donnees!, 'DONNEES');
    const predictions = this.donneesService.predictionsPuissancesRendements(this.modeleEtDonnees!);
    datasets.datasets.push(this.graphiquesService.donneesChart(predictions, 'PREDICTIONS').datasets[0]);
    this.donneesChart = datasets;

    this.donneesService.libererTenseursDans(predictions);
  }

  private tracerInformations() {
    // tf.enableDebugMode();
    // this.modeleEtDonnees!.modele!.summary();
    // this.modeleEtDonnees!.modele!.weights.forEach(w => {
    //   console.log(w.name, w.shape);
    // });
    // this.modeleEtDonnees!.modele!.layers.forEach(layer => {
    //   console.log(layer.name, layer.weights);
    // });
    // const t1 = tf.tensor([0, 0, 0], [3, 1], 'int32');
    // const t2 = tf.tensor([0, 1, 2], [3, 1], 'int32');
    // (tf.layers.activation({activation: 'linear'}).apply(t2) as any).print();
    // tf.losses.meanSquaredError(t1, t2).print();
    // tf.metrics.binaryAccuracy(t1, t2).print();
  }
}
