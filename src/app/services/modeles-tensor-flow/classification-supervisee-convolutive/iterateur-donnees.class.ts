import * as tf from '@tensorflow/tfjs';
import {DonneesService} from './donnees.service';
import {Donnees} from '../regression-supervisee/donnees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';

export class IterateurDonnees {
  private indexEntrainementMelange: number = 0;
  private indexPredictionMelange: number = 0;
  private indexEntrainements: Uint32Array;
  private indexPredictions: Uint32Array;
  private imagesEntrainements: Float32Array;
  private imagesPredictions: Float32Array;
  private booleenChiffresImagesEntrainements: Uint8Array;
  private booleenChiffresImagesPredictions: Uint8Array;

  constructor(images: Float32Array, chiffres: Uint8Array) {
    this.indexEntrainements = tf.util.createShuffledIndices(DonneesService.NOMBRE_IMAGES_ENTRAINEMENT);
    this.indexPredictions = tf.util.createShuffledIndices(DonneesService.NOMBRE_IMAGES_PREDICTIONS);

    this.imagesEntrainements = images.slice(0, DonneesService.NOMBRE_PIXELS_IMAGE * DonneesService.NOMBRE_IMAGES_ENTRAINEMENT);
    this.imagesPredictions = images.slice(DonneesService.NOMBRE_PIXELS_IMAGE * DonneesService.NOMBRE_IMAGES_ENTRAINEMENT);
    this.booleenChiffresImagesEntrainements = chiffres.slice(0, DonneesService.CHIFFRES_DISTINCTS * DonneesService.NOMBRE_IMAGES_ENTRAINEMENT);
    this.booleenChiffresImagesPredictions = chiffres.slice(DonneesService.CHIFFRES_DISTINCTS * DonneesService.NOMBRE_IMAGES_ENTRAINEMENT);
  }

  public donneesEntrainementSuivantes(batchSize: number): Donnees<Rank.R2> {
    return this.lotSuivant(
      batchSize, [this.imagesEntrainements, this.booleenChiffresImagesEntrainements], () => {
        this.indexEntrainementMelange = (this.indexEntrainementMelange + 1) % this.indexEntrainements.length;
        return this.indexEntrainements[this.indexEntrainementMelange];
      });
  }

  public donneesPredictionSuivantes(batchSize: number): Donnees<Rank.R2> {
    return this.lotSuivant(batchSize, [this.imagesPredictions, this.booleenChiffresImagesPredictions], () => {
      this.indexPredictionMelange = (this.indexPredictionMelange + 1) % this.indexPredictions.length;
      return this.indexPredictions[this.indexPredictionMelange];
    });
  }

  private lotSuivant(tailleLot: number, donnees: [Float32Array, Uint8Array], index: () => number): Donnees<Rank.R2> {
    const lotImages = new Float32Array(tailleLot * DonneesService.NOMBRE_PIXELS_IMAGE);
    const lotBooleenChiffresImages = new Uint8Array(tailleLot * DonneesService.CHIFFRES_DISTINCTS);

    for (let i = 0; i < tailleLot; i++) {
      const idx = index();

      const image =
        donnees[0].slice(idx * DonneesService.NOMBRE_PIXELS_IMAGE, idx * DonneesService.NOMBRE_PIXELS_IMAGE + DonneesService.NOMBRE_PIXELS_IMAGE);
      lotImages.set(image, i * DonneesService.NOMBRE_PIXELS_IMAGE);

      const booleenChiffres =
        donnees[1].slice(idx * DonneesService.CHIFFRES_DISTINCTS, idx * DonneesService.CHIFFRES_DISTINCTS + DonneesService.CHIFFRES_DISTINCTS);
      lotBooleenChiffresImages.set(booleenChiffres, i * DonneesService.CHIFFRES_DISTINCTS);
    }

    const entrees = tf.tensor2d(lotImages, [tailleLot, DonneesService.NOMBRE_PIXELS_IMAGE]);
    const sorties = tf.tensor2d(lotBooleenChiffresImages, [tailleLot, DonneesService.CHIFFRES_DISTINCTS]);

    return {entrees, sorties};
  }
}
