import {Component, OnInit} from '@angular/core';
import {DonneesService} from '../../../../../services/modeles-tensor-flow/etudes/donnees.service';
import {ParametresModele} from '../../commun/formulaire-modele/parametres-modele.interface';
import {ModeleEtDonnees} from '../../commun/explorateur-modele/modele-et-donnees.interface';
import {
  PontDonneesCoursVagues
} from '../../../../../services/modeles-tensor-flow/etudes/regression-supervisee/pont-donnees-cours-vagues.class';
import {TranslatePipe} from '@ngx-translate/core';
import {FormulaireModeleComponent} from '../../commun/formulaire-modele/formulaire-modele.component';
import {Button} from 'primeng/button';
import {BarreProgressionComponent} from '../../../../commun/barre-progression/barre-progression.component';
import {ExplorateurModeleComponent} from '../../commun/explorateur-modele/explorateur-modele.component';
import {ModelesService} from '../../../../../services/modeles-tensor-flow/etudes/regression-supervisee/modeles.service';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {Logs, Rank} from '@tensorflow/tfjs';
import {ModeleService} from '../../../../../services/modeles-tensor-flow/commun/modeles/modele.service';
import {GraphiquesService} from '../../../../../services/modeles-tensor-flow/commun/graphiques/graphiques.service';
import {UIChart} from 'primeng/chart';
import {Tensor} from '@tensorflow/tfjs-core';
import {DecimalPipe} from '@angular/common';
import {NombreTenseurs} from '../../commun/nombre-tenseurs/nombre-tenseurs';

@Component({
  selector: 'app-entrainement-modele-regression-supervisee',
  imports: [
    TranslatePipe,
    FormulaireModeleComponent,
    Button,
    BarreProgressionComponent,
    ExplorateurModeleComponent,
    UIChart,
    DecimalPipe,
    NombreTenseurs
  ],
  templateUrl: './entrainement-modele-regression-supervisee.component.html',
  styleUrl: './entrainement-modele-regression-supervisee.component.sass',
})
export class EntrainementModeleRegressionSuperviseeComponent implements OnInit {
  protected parametresModele: ParametresModele = {
    tauxApprentissage: 0.1,
    iterations: 50,
    lot: 50,
    optimiseur: 'adam',
    fonctionsPertes: ['meanSquaredError'],
    metriques: ['binaryAccuracy']
  };

  // données, modèle, couches
  protected pontDonnees?: PontDonneesCoursVagues;
  protected progressionEntrainement: number = 0;
  protected modeleEtDonnees?: ModeleEtDonnees;

  // https://www.chartjs.org/
  protected entrainementChart?: any;
  protected entrainementChartOptions?: any;

  //
  protected predictionsParAttendu?: Map<number, Array<number>>;

  constructor(private graphiquesService: GraphiquesService,
              private donneesService: DonneesService,
              private modelesService: ModelesService,
              private modeleService: ModeleService) {
    this.entrainementChartOptions = this.graphiquesService.entrainementChartOptions();
  }

  ngOnInit(): void {
    this.donneesService.donneesCoursVaguesRegression()
      .then(pontDonnees => {
        this.pontDonnees = pontDonnees;
      });
  }

  protected entrainerModele() {
    if (this.pontDonnees) {
      this.modeleEtDonnees = undefined;
      const modeleCouches: LayersModel = this.modelesService.modeleCoursVagues(this.parametresModele, this.pontDonnees.tailleEntree());
      this.progressionEntrainement = 0;
      const logs: Array<Logs> = [];
      const donneesNormalisees = this.pontDonnees.donneesNormaliseesEntrainement();

      modeleCouches.fit(donneesNormalisees.entrees, donneesNormalisees.sorties, {
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
          entrees: donneesNormalisees.entrees,
          sorties: donneesNormalisees.sorties
        };
        this.entrainementTermine(logs);
      });
    }
  }

  private entrainementTermine(logs: Array<Logs>) {
    if (this.modeleEtDonnees && this.pontDonnees) {
      // line chart : affichage des metrics d'entrainement
      this.entrainementChart = this.graphiquesService.entrainementChart(logs);
      const sortiesPredictions: Tensor<Rank.R2> = this.pontDonnees.denormaliserSorties(
        this.modeleEtDonnees.modeleCouches.predict(this.pontDonnees.entreesNormaliseesPredictions()) as Tensor<Rank.R2>
      );
      const sortiesAttendues = this.pontDonnees.sortiesAttenduesPredictions();

      const predictions = sortiesPredictions.dataSync();
      const predictionsParAttendu = new Map<number, Array<number>>();
      sortiesAttendues.dataSync().forEach((attendu, i) => {
        predictionsParAttendu.set(attendu, (predictionsParAttendu.get(attendu) || []).concat([predictions[i]]));
      });
      this.predictionsParAttendu = predictionsParAttendu;

      sortiesPredictions.dispose();
      sortiesAttendues.dispose();
    }
  }
}
