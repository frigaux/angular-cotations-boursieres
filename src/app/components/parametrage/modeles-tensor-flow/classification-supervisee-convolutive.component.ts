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
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UIChart} from 'primeng/chart';
import {GraphiquesService} from '../../../services/modeles-tensor-flow/regression-supervisee/graphiques.service';
import {NgClass, PercentPipe} from '@angular/common';

@Component({
  selector: 'app-classification-supervisee-convolutive',
  imports: [
    LoaderComponent,
    TranslatePipe,
    BarreProgressionComponent,
    Button,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    FormsModule,
    UIChart,
    NgClass,
    PercentPipe
  ],
  templateUrl: './classification-supervisee-convolutive.component.html',
  styleUrl: './classification-supervisee-convolutive.component.sass',
})
export class ClassificationSuperviseeConvolutiveComponent implements OnInit {
  // données pour la vue
  protected loading: boolean = true;

  // nombre de tenseur en mémoire
  protected nombreTenseurs?: number;

  // données, modèle, couches
  protected iterateurDonnees?: IterateurDonnees;
  protected progressionEntrainement: number = 0;
  protected modele?: LayersModel;

  // chiffres des images affichées
  protected booleenParChiffreParImage?: number[][];

  // paramètres apprentissage
  protected tauxApprentissage: number = 0.01;
  protected nombreIterations: number = 10;
  protected tailleLot: number = 32;
  protected nombreImagesEntrainement: number = 640;
  protected nombreImagesPredictions: number = 200;

  // https://www.chartjs.org/
  protected entrainementChart?: any;
  protected entrainementChartOptions?: any;

  // analyses prédictions
  private predictionsParChiffre?: Array<Array<number>>;
  private predictionsParChiffreArgMax?: Array<Array<number>>;
  protected predictionsAgregees?: Array<{
    pourcentage: number,
    pourcentageArgMax: number,
    predictions: Array<{ chiffrePredit: number, quantite: number }>
  }>;

  constructor(private graphiquesService: GraphiquesService,
              private donneesService: DonneesService,
              private modelesService: ModelesService) {
    this.entrainementChartOptions = this.graphiquesService.entrainementChartOptions();
  }

  ngOnInit(): void {
    window.setInterval(() => this.nombreTenseurs = tf.memory().numTensors, 1000);
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

  private remodelerTenseurs(tailleLot: number, donnees: () => Donnees<Rank.R2>): [Tensor2D, Tensor2D] {
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

  protected entrainerModele() {
    if (this.iterateurDonnees) {
      this.modele = undefined;
      this.progressionEntrainement = 0;
      const modele: LayersModel = this.modelesService.modeleFonctionnelImagesChiffres(this.tauxApprentissage);

      const [imagesEntrainement, chiffresAttendusEntrainement] = this.remodelerTenseurs(this.nombreImagesEntrainement,
        () => this.iterateurDonnees!.donneesEntrainementSuivantes(this.nombreImagesEntrainement));
      const [imagesValidation, chiffresAttendusValidation] = this.remodelerTenseurs(this.nombreImagesPredictions,
        () => this.iterateurDonnees!.donneesPredictionSuivantes(this.nombreImagesPredictions));

      const logsEpoch: Array<Logs> = [];
      modele.fit(imagesEntrainement, chiffresAttendusEntrainement, {
        epochs: this.nombreIterations,
        batchSize: this.tailleLot,
        validationData: [imagesValidation, chiffresAttendusValidation],
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch, log) => {
            if (log) {
              logsEpoch.push(log);
            }
            const pourcentage = Math.round(100 * epoch / this.nombreIterations);
            if (!this.progressionEntrainement || pourcentage > this.progressionEntrainement) {
              this.progressionEntrainement = pourcentage;
            }
          }
        }
      }).then(() => {
        this.modele = modele;
        this.entrainementChart = this.graphiquesService.entrainementChart(logsEpoch);
        this.predictions();
      });
    }
  }

  private predictions() {
    this.tracerInformations();
    tf.tidy(() => {
      const [images, chiffresAttendus] = this.remodelerTenseurs(this.nombreImagesPredictions,
        () => this.iterateurDonnees!.donneesPredictionSuivantes(this.nombreImagesPredictions));

      const predictions: Tensor2D = this.modele!.predict(images) as Tensor2D;

      // this.analysesPredictions(chiffresAttendus.argMax(-1).arraySync() as number[],
      //   predictions.argMax(-1).arraySync() as number[]);
      this.analysesPredictions(chiffresAttendus, predictions);
    });
    // TODO : dispose ?
    // images.dispose();
    // chiffresAttendus.dispose();
    // predictions.dispose();
  }

  // private analysesPredictions(chiffresAttendus: number[], chiffresPredits: number[]) {
  //   const predictionsParChiffre: Array<Array<number>> = Array.from({length: DonneesService.CHIFFRES_DISTINCTS},
  //     (v, i) => Array.from({length: DonneesService.CHIFFRES_DISTINCTS}, (v, i) => 0));
  //   chiffresAttendus.forEach((chiffreAttendu, i) => {
  //     predictionsParChiffre[chiffreAttendu][chiffresPredits[i]] = predictionsParChiffre[chiffreAttendu][chiffresPredits[i]] + 1;
  //   });
  //   this.predictionsParChiffre = predictionsParChiffre;
  //
  //   const predictionsAgregees: Array<{
  //     reussites: number,
  //     total: number,
  //     predictions: Array<{ chiffrePredit: number, quantite: number }>
  //   }> = [];
  //   predictionsParChiffre.forEach((chiffresPredits, chiffreAttendu) => {
  //     const total = chiffresPredits.reduce((acc, qt) => acc + qt, 0);
  //     const reussites = chiffresPredits[chiffreAttendu];
  //     const predictions: Array<{ chiffrePredit: number, quantite: number }> = [];
  //     chiffresPredits.forEach((quantite, chiffrePredit) => {
  //       if (quantite !== 0) {
  //         predictions.push({chiffrePredit, quantite})
  //       }
  //     });
  //     predictionsAgregees.push({reussites, total, predictions});
  //   });
  //   this.predictionsAgregees = predictionsAgregees;
  // }

  private analysesPredictions(chiffresAttendus: Tensor2D, predictions: Tensor2D) {
    const chiffresAttendusArgMax: number[] = chiffresAttendus.argMax(-1).arraySync() as number[];
    const chiffresPreditsArgMax: number[] = predictions.argMax(-1).arraySync() as number[];
    const chiffresPredits: number[][] = predictions.arraySync();

    const predictionsParChiffre: Array<Array<number>> = Array.from({length: DonneesService.CHIFFRES_DISTINCTS},
      (v, i) => Array.from({length: DonneesService.CHIFFRES_DISTINCTS}, (v, i) => 0));
    const predictionsParChiffreArgMax: Array<Array<number>> = Array.from({length: DonneesService.CHIFFRES_DISTINCTS},
      (v, i) => Array.from({length: DonneesService.CHIFFRES_DISTINCTS}, (v, i) => 0));
    chiffresAttendusArgMax.forEach((chiffreAttendu, i) => {
      predictionsParChiffreArgMax[chiffreAttendu][chiffresPreditsArgMax[i]] = predictionsParChiffreArgMax[chiffreAttendu][chiffresPreditsArgMax[i]] + 1;
      chiffresPredits[i].forEach((prediction, chiffrePredit) => {
        predictionsParChiffre[chiffreAttendu][chiffrePredit] = predictionsParChiffre[chiffreAttendu][chiffrePredit] + prediction;
      });
    });
    this.predictionsParChiffre = predictionsParChiffre;
    this.predictionsParChiffreArgMax = predictionsParChiffreArgMax;

    const predictionsAgregees: Array<{
      pourcentage: number,
      pourcentageArgMax: number,
      predictions: Array<{ chiffrePredit: number, quantite: number }>
    }> = [];
    predictionsParChiffreArgMax.forEach((chiffresPredits, chiffreAttendu) => {
      const total = predictionsParChiffre[chiffreAttendu].reduce((acc, qt) => acc + qt, 0);
      const reussites = predictionsParChiffre[chiffreAttendu][chiffreAttendu];
      const pourcentage = reussites / total;
      const totalArgMax = chiffresPredits.reduce((acc, qt) => acc + qt, 0);
      const reussitesArgMax = chiffresPredits[chiffreAttendu];
      const pourcentageArgMax = reussitesArgMax / totalArgMax;
      const predictions: Array<{ chiffrePredit: number, quantite: number }> = [];
      chiffresPredits.forEach((quantite, chiffrePredit) => {
        if (quantite !== 0) {
          predictions.push({chiffrePredit, quantite});
        }
      });
      predictionsAgregees.push({pourcentage, pourcentageArgMax, predictions});
    });
    this.predictionsAgregees = predictionsAgregees;
  }

  private tracerInformations() {
    // tf.enableDebugMode();
    // this.modele!.summary();
    // this.modele!.weights.forEach(w => {
    //   console.log(w.name, w.shape);
    // });
    // this.modele!.layers.forEach(layer => {
    //   console.log(layer.name, layer.weights);
    // });
  }
}
