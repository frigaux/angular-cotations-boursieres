import * as tf from '@tensorflow/tfjs';
import {Rank} from '@tensorflow/tfjs';
import {DonneesCoursVagues} from './donnees-cours-vagues.class';
import {DonneesService} from './donnees.service';
import {Donnees} from '../../tutoriels/regression-supervisee/donnees.interface';
import {Tensor} from '@tensorflow/tfjs-core';

export class PontDonnees {
  private entrees: Array<Array<number>>;
  private sorties: Array<Array<number>>;
  private entreesNormalisees: { min: number; max: number; donneesNormalisees: number[][] };
  private sortiesNormalisees: { min: number; max: number; donneesNormalisees: number[][] };

  constructor(donnees: Array<DonneesCoursVagues>) {
    donnees = this.filtrerDonnees(donnees);
    if (donnees.length > DonneesService.DONNEES_ENTRAINEMENT) {
      this.entrees = donnees.map(d =>
        d.cours.map(value => value.cloture)
      );

      this.sorties = donnees.map(d => [d.nbVagues!]);

      this.entreesNormalisees = this.normaliser(this.entrees);
      this.sortiesNormalisees = this.normaliser(this.sorties);
    } else {
      throw new Error(`Pas assez de données : ${donnees.length} <= ${DonneesService.DONNEES_ENTRAINEMENT}`);
    }
  }

  private filtrerDonnees(donnees: Array<DonneesCoursVagues>) {
    return donnees.filter(d => d.nbVagues !== undefined && d.nbVagues !== null);
  }

  public donneesNormaliseesEntrainement(): Donnees<Rank.R2> {
    const donnees = this.entreesNormalisees.donneesNormalisees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
    const sorties = this.sortiesNormalisees.donneesNormalisees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
    return {
      entrees: tf.tensor2d(donnees, [DonneesService.DONNEES_ENTRAINEMENT, donnees[0].length]),
      sorties: tf.tensor2d(sorties, [DonneesService.DONNEES_ENTRAINEMENT, sorties[0].length])
    };
  }

  public entreesNormaliseesPredictions(): Tensor<Rank.R2> {
    const donnees = this.entreesNormalisees.donneesNormalisees.slice(DonneesService.DONNEES_ENTRAINEMENT);
    return tf.tensor2d(donnees, [donnees.length, donnees[0].length]);
  }

  public sortiesPredictions(): Tensor<Rank.R2> {
    const sorties = this.sorties.slice(DonneesService.DONNEES_ENTRAINEMENT);
    return tf.tensor2d(sorties, [sorties.length, sorties[0].length]);
  }

  private normaliser(donnees: Array<Array<number>>) {
    const min = Math.min(...donnees.map(liste => Math.min(...liste)));
    const max = Math.max(...donnees.map(liste => Math.max(...liste)));
    return {min, max, donneesNormalisees: donnees.map(liste => liste.map(valeur => (valeur - min) / (max - min)))};
  }
}
