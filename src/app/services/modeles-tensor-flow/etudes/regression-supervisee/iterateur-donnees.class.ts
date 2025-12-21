import * as tf from '@tensorflow/tfjs';
import {DonneesCoursVagues} from './donnees-cours-vagues.class';
import {DonneesService} from './donnees.service';

export class IterateurDonnees {
  private indexEntrainementMelange: number = 0;
  private indexPredictionMelange: number = 0;
  private indexEntrainements: Uint32Array;
  private indexPredictions: Uint32Array;
  // private imagesEntrainements: Array<DonneesCoursVagues>;
  // private imagesPredictions: Array<DonneesCoursVagues>;

  constructor(donnees: Array<DonneesCoursVagues>) {
    donnees = donnees.filter(d => d.nbVagues !== undefined && d.nbVagues !== null);
    if (donnees.length > DonneesService.DONNEES_ENTRAINEMENT) {
      this.indexEntrainements = tf.util.createShuffledIndices(DonneesService.DONNEES_ENTRAINEMENT);
      this.indexPredictions = tf.util.createShuffledIndices(donnees.length - DonneesService.DONNEES_ENTRAINEMENT);

      const entrees: Array<Array<number>> = donnees.map(d =>
        d.cours.map(value => value.cloture)
      );

      const sorties: Array<number> = donnees.map(d => d.nbVagues!);

      console.log(entrees, sorties);

      // this.imagesEntrainements = donnees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
      // this.imagesPredictions = donnees.slice(DonneesService.DONNEES_ENTRAINEMENT);
    } else {
      throw new Error(`Pas assez de données : ${donnees.length} <= ${DonneesService.DONNEES_ENTRAINEMENT}`);
    }
  }

  // public donneesEntrainementSuivantes(batchSize: number): Donnees<Rank.R2> {
  //   return this.lotSuivant(
  //     batchSize, [this.imagesEntrainements, this.booleenChiffresImagesEntrainements], () => {
  //       this.indexEntrainementMelange = (this.indexEntrainementMelange + 1) % this.indexEntrainements.length;
  //       return this.indexEntrainements[this.indexEntrainementMelange];
  //     });
  // }
  //
  // public donneesPredictionSuivantes(batchSize: number): Donnees<Rank.R2> {
  //   return this.lotSuivant(batchSize, [this.imagesPredictions, this.booleenChiffresImagesPredictions], () => {
  //     this.indexPredictionMelange = (this.indexPredictionMelange + 1) % this.indexPredictions.length;
  //     return this.indexPredictions[this.indexPredictionMelange];
  //   });
  // }
  //
  // private lotSuivant(tailleLot: number, donnees: [Float32Array, Uint8Array], index: () => number): Donnees<Rank.R2> {
  //
  //   const lotImages = new Float32Array(tailleLot * DonneesService.NOMBRE_PIXELS_IMAGE);
  //   const lotBooleenChiffresImages = new Uint8Array(tailleLot * DonneesService.CHIFFRES_DISTINCTS);
  //
  //   for (let i = 0; i < tailleLot; i++) {
  //     const idx = index();
  //
  //     const image =
  //       donnees[0].slice(idx * DonneesService.NOMBRE_PIXELS_IMAGE, idx * DonneesService.NOMBRE_PIXELS_IMAGE + DonneesService.NOMBRE_PIXELS_IMAGE);
  //     lotImages.set(image, i * DonneesService.NOMBRE_PIXELS_IMAGE);
  //
  //     const booleenChiffres =
  //       donnees[1].slice(idx * DonneesService.CHIFFRES_DISTINCTS, idx * DonneesService.CHIFFRES_DISTINCTS + DonneesService.CHIFFRES_DISTINCTS);
  //     lotBooleenChiffresImages.set(booleenChiffres, i * DonneesService.CHIFFRES_DISTINCTS);
  //   }
  //
  //   const entrees = tf.tensor2d(lotImages, [tailleLot, DonneesService.NOMBRE_PIXELS_IMAGE]);
  //   const sorties = tf.tensor2d(lotBooleenChiffresImages, [tailleLot, DonneesService.CHIFFRES_DISTINCTS]);
  //
  //   return {entrees, sorties};
  // }
}
