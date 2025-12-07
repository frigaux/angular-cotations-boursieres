import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {Logs} from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {BarreProgressionComponent} from '../../commun/barre-progression/barre-progression.component';
import {JsonPipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {ModelesService} from '../../../services/modele-apprentissage-automatique/modeles.service';
import {DonneesService} from '../../../services/modele-apprentissage-automatique/donnees.service';
import {GraphiquesService} from '../../../services/modele-apprentissage-automatique/graphiques.service';
import {FloatLabel} from 'primeng/floatlabel';
import {Donnees} from '../../../services/modele-apprentissage-automatique/donnees.interface';

// TODO : prediction sur modeleFonctionAffine ? virer input valeur et bouton predire ?
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
    InputText,
    FloatLabel
  ],
  templateUrl: './modele-apprentissage-automatique.component.html',
  styleUrl: './modele-apprentissage-automatique.component.sass',
})
export class ModeleApprentissageAutomatiqueComponent implements OnInit {
  // données pour la vue
  protected nombreTenseurs?: number;

  // liste déroulantes
  protected backends: Array<string> = ['cpu', 'webgl']; // 'tensorflow' (requires tfjs-node), 'wasm' (requires tfjs-backend-wasm).
  protected backend: string = this.backends[0];
  protected backendChangeAvecSucces?: boolean;

  //
  protected tauxApprentissage: number = 0.1;
  protected epochs: number = 50;
  protected tailleLot: number = 32;

  //
  protected progressionEntrainement: number = 0;
  protected donnees?: Donnees;
  protected modele?: LayersModel;
  protected valeur?: number;
  protected prediction?: any;

  // https://www.chartjs.org/
  protected donneesChart?: any;
  protected donneesChartOptions?: any;
  protected entrainementChart?: any;
  protected entrainementChartOptions?: any;
  protected predictionChart?: any;
  protected predictionChartOptions?: any;

  constructor(private graphiquesService: GraphiquesService,
              private modelesService: ModelesService,
              private donneesService: DonneesService) {
    this.donneesChartOptions = this.graphiquesService.donneesChartOptions();
    this.entrainementChartOptions = this.graphiquesService.entrainementChartOptions();
    this.predictionChartOptions = this.graphiquesService.donneesChartOptions();
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

      const donneesNormalisees = this.donneesService.normaliser(this.donnees);
      this.progressionEntrainement = 0;
      const logs: Array<Logs> = [];
      modele.fit(donneesNormalisees.entrees, donneesNormalisees.sorties, {
        epochs: this.epochs,
        batchSize: this.tailleLot,
        shuffle: true,
        // validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, log) => {
            if (log) {
              logs.push(log);
            }
            const pourcentage = Math.round(100 * epoch / this.epochs);
            if (!this.progressionEntrainement || pourcentage > this.progressionEntrainement) {
              this.progressionEntrainement = pourcentage;
            }
          }
        }
      }).then(() => {
        // this.donnees.x.dispose();
        // this.donnees.y.dispose();
        // tf.enableDebugMode();
        // console.log('modele', modele.summary());
        // modele.weights.forEach(w => {
        //   console.log(w);
        // });
        this.entrainementChart = this.graphiquesService.entrainementChart(logs);
        this.modele = modele;
        this.predictionChart = this.graphiquesService.donneesChart(
          this.donneesService.predictionsPuissanceRendement(modele, donneesNormalisees)
          , 'PREDICTIONS');
      });
    }
  }

  protected predireAvecLeModele() {
    if (this.valeur) {
      tf.tidy(() => {
        const prediction: any = this.modele!.predict(tf.tensor([this.valeur!], [1, 1], 'int32'));
        prediction.array().then((array: any) => this.prediction = array);
      });
    }
  }
}
