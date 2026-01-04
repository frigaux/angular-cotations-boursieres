import * as tf from '@tensorflow/tfjs';
import {Rank} from '@tensorflow/tfjs';
import {DonneesCoursVagues} from '../donnees-cours-vagues.class';
import {DonneesService} from '../donnees.service';
import {Donnees} from '../../tutoriels/regression-supervisee/donnees.interface';
import {Tensor} from '@tensorflow/tfjs-core';
import {DonneesBuilder} from '../../commun/donnees-builder.class';

export class PontDonneesCoursVagues {
  private entrees: Array<Array<number>>;
  private sorties: Array<Array<number>>;
  private entreesNormalisees: number[][];
  private sortiesNormalisees: { min: number; max: number; donneesNormalisees: number[][] };

  constructor(donnees: Array<DonneesCoursVagues>) {
    donnees = this.filtrerDonnees(donnees);
    if (donnees.length > DonneesService.DONNEES_ENTRAINEMENT) {
      this.entrees = donnees.map(data =>
        new DonneesBuilder(data.cours.map(value => value.cloture))
          .calculerMMG(10)
          // .calculerVariation()
          .build()
      );

      this.sorties = donnees.map(d => [d.nbVagues!]);

      this.entreesNormalisees = this.normaliserEntrees(this.entrees);
      this.sortiesNormalisees = this.normaliserSorties(this.sorties);
    } else {
      throw new Error(`Pas assez de données : ${donnees.length} <= ${DonneesService.DONNEES_ENTRAINEMENT}`);
    }
  }

  public tailleEntree(): number {
    return this.entrees[0].length;
  }

  public donneesNormaliseesEntrainement(): Donnees<Rank.R2> {
    const donnees = this.entreesNormalisees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
    const sorties = this.sortiesNormalisees.donneesNormalisees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
    return {
      entrees: tf.tensor2d(donnees, [DonneesService.DONNEES_ENTRAINEMENT, donnees[0].length]),
      sorties: tf.tensor2d(sorties, [DonneesService.DONNEES_ENTRAINEMENT, sorties[0].length])
    };
  }

  public entreesNormaliseesPredictions(): Tensor<Rank.R2> {
    const donnees = this.entreesNormalisees.slice(DonneesService.DONNEES_ENTRAINEMENT);
    return tf.tensor2d(donnees, [donnees.length, donnees[0].length]);
  }

  public sortiesAttenduesPredictions(): Tensor<Rank.R2> {
    const sorties = this.sorties.slice(DonneesService.DONNEES_ENTRAINEMENT);
    return tf.tensor2d(sorties, [sorties.length, sorties[0].length]);
  }

  public denormaliserSorties(sorties: Tensor<Rank.R2>): Tensor<Rank.R2> {
    const min = this.sortiesNormalisees.min;
    const max = this.sortiesNormalisees.max;
    return sorties
      .mul(max - min)
      .add(min);
  }

  private filtrerDonnees(donnees: Array<DonneesCoursVagues>) {
    return donnees.filter(d => d.nbVagues !== undefined && d.nbVagues !== null);
  }

  private normaliserEntrees(entrees: Array<Array<number>>) {
    return entrees.map(entree => {
      const min = Math.min(...entree);
      const max = Math.max(...entree);
      return entree.map(valeur => (valeur - min) / (max - min));
    });
  }

  private normaliserSorties(sorties: Array<Array<number>>) {
    const min = Math.min(...sorties.map(liste => Math.min(...liste)));
    const max = Math.max(...sorties.map(liste => Math.max(...liste)));
    return {min, max, donneesNormalisees: sorties.map(liste => liste.map(valeur => (valeur - min) / (max - min)))};
  }
}
