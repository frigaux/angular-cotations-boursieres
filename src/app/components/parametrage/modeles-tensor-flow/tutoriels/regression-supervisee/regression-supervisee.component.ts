import {Component, OnInit} from '@angular/core';
import {Logs} from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {BarreProgressionComponent} from '../../../../commun/barre-progression/barre-progression.component';
import {UIChart} from 'primeng/chart';
import {FormsModule} from '@angular/forms';
import {
  ModelesService
} from '../../../../../services/modeles-tensor-flow/tutoriels/regression-supervisee/modeles.service';
import {
  DonneesService
} from '../../../../../services/modeles-tensor-flow/tutoriels/regression-supervisee/donnees.service';
import {GraphiquesService} from '../../../../../services/modeles-tensor-flow/graphiques/graphiques.service';
import {Donnees} from '../../../../../services/modeles-tensor-flow/tutoriels/regression-supervisee/donnees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';
import {ExplorateurModeleComponent} from '../../commun/explorateur-modele/explorateur-modele.component';
import {ModeleEtDonnees} from '../../commun/explorateur-modele/modele-et-donnees.interface';
import {ModeleService} from '../../../../../services/modeles-tensor-flow/modeles/modele.service';
import {
  DonneesNormalisees
} from '../../../../../services/modeles-tensor-flow/tutoriels/regression-supervisee/donnees-normalisees.interface';
import {FormulaireModeleComponent} from '../../commun/formulaire-modele/formulaire-modele.component';
import {ParametresModele} from '../../commun/formulaire-modele/parametres-modele.interface';

@Component({
  selector: 'app-regression-supervisee',
  imports: [
    TranslatePipe,
    Button,
    BarreProgressionComponent,
    UIChart,
    FormsModule,
    ExplorateurModeleComponent,
    FormulaireModeleComponent
  ],
  templateUrl: './regression-supervisee.component.html',
  styleUrl: './regression-supervisee.component.sass',
})
export class RegressionSuperviseeComponent implements OnInit {
  protected parametresModele: ParametresModele = {
    tauxApprentissage: 0.1,
    iterations: 50,
    lot: 32
  };

  // données, modèle, couches
  protected donnees?: Donnees<Rank.R2>;
  protected progressionEntrainement: number = 0;
  protected modeleEtDonnees?: ModeleEtDonnees;
  private donneesNormalisees?: DonneesNormalisees;

  // https://www.chartjs.org/
  protected donneesChart?: any;
  protected donneesChartOptions?: any;
  protected entrainementChart?: any;
  protected entrainementChartOptions?: any;

  constructor(private graphiquesService: GraphiquesService,
              private modelesService: ModelesService,
              private donneesService: DonneesService,
              private modeleService: ModeleService) {
    this.donneesChartOptions = this.graphiquesService.donneesChartOptions();
    this.entrainementChartOptions = this.graphiquesService.entrainementChartOptions();
  }

  ngOnInit(): void {
    this.donneesService.donneesPuissancesRendements()
      .then(donnees => {
        this.donnees = donnees;
        this.donneesChart = this.graphiquesService.donneesChart(donnees, 'DONNEES');
      });
  }

  protected entrainerModele() {
    if (this.donnees) {
      this.modeleEtDonnees = undefined;
      const modeleCouches: LayersModel = this.modelesService.modelePuissancesRendements(this.parametresModele.tauxApprentissage);

      this.donneesNormalisees = this.donneesService.normaliserZeroAUn(this.donnees);
      this.progressionEntrainement = 0;
      const logs: Array<Logs> = [];
      modeleCouches.fit(this.donneesNormalisees.entrees, this.donneesNormalisees.sorties, {
        epochs: this.parametresModele.iterations,
        batchSize: this.parametresModele.lot,
        shuffle: true,
        // validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, log) => {
            if (log) {
              logs.push(log);
            }
            const pourcentage = Math.round(100 * epoch / this.parametresModele.iterations);
            if (!this.progressionEntrainement || pourcentage > this.progressionEntrainement) {
              this.progressionEntrainement = pourcentage;
            }
          }
        }
      }).then(() => {
        this.modeleEtDonnees = {
          modeleCouches,
          modele: this.modeleService.modele(modeleCouches),
          entrees: this.donneesNormalisees!.entrees,
          sorties: this.donneesNormalisees!.sorties
        };
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
    const predictions = this.donneesService.predictionsPuissancesRendements(this.modeleEtDonnees!.modeleCouches, this.donneesNormalisees!);
    datasets.datasets.push(this.graphiquesService.donneesChart(predictions, 'PREDICTIONS').datasets[0]);
    this.donneesChart = datasets;

    this.donneesService.libererTenseursDans(predictions);
  }

  private tracerInformations() {
    // console.log(this.donnees!.entrees.arraySync(), this.modeleEtDonnees!.entrees.dataSync());
    // tf.enableDebugMode();
    // this.modeleEtDonnees!.modeleCouches.summary();
    // this.modeleEtDonnees!.modeleCouches.weights.forEach(w => {
    //   console.log(w.name, w.shape);
    // });
    // this.modeleEtDonnees!.modeleCouches.layers.forEach(layer => {
    //   console.log(layer.name, layer.weights);
    // });
    // const t1 = tf.tensor([0, 0, 0], [3, 1], 'int32');
    // const t2 = tf.tensor([0, 1, 2], [3, 1], 'int32');
    // (tf.layers.activation({activation: 'linear'}).apply(t2) as any).print();
    // tf.losses.meanSquaredError(t1, t2).print();
    // tf.metrics.binaryAccuracy(t1, t2).print();
  }
}
