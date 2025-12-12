import {Component, OnInit} from '@angular/core';
import {
  DonneesService
} from '../../../services/modeles-tensor-flow/classification-supervisee-convolutive/donnees.service';
import {
  IterateurDonnees
} from '../../../services/modeles-tensor-flow/classification-supervisee-convolutive/iterateur-donnees.class';
import {LoaderComponent} from '../../loader/loader.component';
import * as tf from '@tensorflow/tfjs';
import {Logs, Tensor2D} from '@tensorflow/tfjs';
import {TranslatePipe} from '@ngx-translate/core';
import {BarreProgressionComponent} from '../../commun/barre-progression/barre-progression.component';
import {Button} from 'primeng/button';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {
  ModelesService
} from '../../../services/modeles-tensor-flow/classification-supervisee-convolutive/modeles.service';
import {Donnees} from '../../../services/modeles-tensor-flow/regression-supervisee/donnees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';

@Component({
  selector: 'app-classification-supervisee-convolutive',
  imports: [
    LoaderComponent,
    TranslatePipe,
    BarreProgressionComponent,
    Button
  ],
  templateUrl: './classification-supervisee-convolutive.component.html',
  styleUrl: './classification-supervisee-convolutive.component.sass',
})
export class ClassificationSuperviseeConvolutiveComponent implements OnInit {
  // données pour la vue
  protected loading: boolean = true;
  protected iterateurDonnees?: IterateurDonnees;
  protected booleenParChiffreParImage?: number[][];

  protected progressionEntrainement: number = 0;
  protected modele?: LayersModel;

  constructor(private donneesService: DonneesService,
              private modelesService: ModelesService) {

  }

  ngOnInit(): void {
    this.donneesService.donneesImagesChiffres()
      .then(iterateurDonnees => {
        this.iterateurDonnees = iterateurDonnees;
        this.loading = false;
        this.afficherLotImages(10);
      });
  }

  private afficherLotImages(tailleLot: number) {
    if (this.iterateurDonnees) {
      const lot = this.iterateurDonnees.donneesPredictionSuivantes(tailleLot);
      this.booleenParChiffreParImage = lot.sorties.arraySync();

      for (let i = 0; i < tailleLot; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE;
        canvas.height = DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE;

        const imageTensor: Tensor2D = tf.tidy(() => {
          return lot.entrees
            .slice([i, 0], [1, lot.entrees.shape[1]!])
            .reshape([
              DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
              DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
              DonneesService.CANAL_NOIR_BLANC
            ]);
        });

        tf.browser.toPixels(imageTensor, canvas)
          .then(() => {
            const oImg: HTMLImageElement = document.getElementById(`img_${i}`) as HTMLImageElement;
            oImg.src = canvas.toDataURL();
            imageTensor.dispose();
          });
      }
    }
  }

  protected entrainerModele() {
    if (this.iterateurDonnees) {
      this.modele = undefined;
      const modele: LayersModel = this.modelesService.modeleImagesChiffres();

      const tailleLot = 32;
      const tailleEntrainement = 640;
      const taillePrediction = 100;
      const nombreIterations = 100;

      const [imagesEntrainement, chiffresEntrainement] = this.extracted(tailleEntrainement, () => this.iterateurDonnees!.donneesEntrainementSuivantes(tailleEntrainement));
      const [imagesPrediction, chiffrePrediction] = this.extracted(taillePrediction, () => this.iterateurDonnees!.donneesPredictionSuivantes(taillePrediction));

      const logsEpoch: Array<Logs> = [];
      const logsBatch: Array<Logs> = [];
      modele.fit(imagesEntrainement, chiffresEntrainement, {
        batchSize: tailleLot,
        validationData: [imagesPrediction, chiffrePrediction],
        epochs: nombreIterations,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, log) => {
            console.log('onEpochEnd', epoch, log);
            if (log) {
              logsEpoch.push(log);
            }
            const pourcentage = Math.round(100 * epoch / nombreIterations);
            if (!this.progressionEntrainement || pourcentage > this.progressionEntrainement) {
              this.progressionEntrainement = pourcentage;
            }
          },
          onBatchEnd: (batch, log) => {
            console.log('onBatchEnd', batch, log);
            if (log) {
              logsBatch.push(log);
            }
          }
        }
      }).then(() => {
        this.modele = modele;
        // this.entrainementTermine(donneesNormalisees, logs);
      });
    }
  }

  private extracted(tailleLot: number, donnees: () => Donnees<Rank.R2>): [Tensor2D, Tensor2D] {
    return tf.tidy(() => {
      const d = donnees();
      return [
        d.entrees.reshape([tailleLot, DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
          DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE,
          DonneesService.CANAL_NOIR_BLANC]),
        d.sorties
      ];
    });
  }
}
