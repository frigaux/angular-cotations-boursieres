import * as tf from '@tensorflow/tfjs';
import {Rank} from '@tensorflow/tfjs';
import {DonneesCoursVagues} from '../donnees-cours-vagues.class';
import {DonneesService} from '../donnees.service';
import {Donnees} from '../../tutoriels/regression-supervisee/donnees.interface';
import {Tensor} from '@tensorflow/tfjs-core';

export class PontDonneesCoursVagues {
  private entrees: Array<Array<number>>;
  private sorties: Array<number>;
  private entreesNormalisees: { min: number; max: number; donneesNormalisees: number[][] };
  private sortiesClassifiees: Array<Array<number>>;

  constructor(donnees: Array<DonneesCoursVagues>) {
    donnees = this.filtrerDonnees(donnees);
    if (donnees.length > DonneesService.DONNEES_ENTRAINEMENT) {
      this.entrees = donnees.map(d =>
        d.cours.map(value => value.cloture)
      );

      this.sorties = donnees.map(d => d.nbVagues!);

      this.entreesNormalisees = this.normaliser(this.entrees);
      this.sortiesClassifiees = this.classifier(this.sorties);
    } else {
      throw new Error(`Pas assez de données : ${donnees.length} <= ${DonneesService.DONNEES_ENTRAINEMENT}`);
    }
  }

  public tailleEntree(): number {
    return this.entrees[0].length;
  }

  public tailleSortie(): number {
    return this.sortiesClassifiees[0].length;
  }

  public donneesEntrainement(): Donnees<Rank.R2> {
    const donnees = this.entreesNormalisees.donneesNormalisees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
    const sorties = this.sortiesClassifiees.slice(0, DonneesService.DONNEES_ENTRAINEMENT);
    return {
      entrees: tf.tensor2d(donnees, [DonneesService.DONNEES_ENTRAINEMENT, donnees[0].length]),
      sorties: tf.tensor2d(sorties, [DonneesService.DONNEES_ENTRAINEMENT, sorties[0].length])
    };
  }

  public entreesNormaliseesPredictions(): Tensor<Rank.R2> {
    const donnees = this.entreesNormalisees.donneesNormalisees.slice(DonneesService.DONNEES_ENTRAINEMENT);
    return tf.tensor2d(donnees, [donnees.length, donnees[0].length]);
  }

  public sortiesAttenduesPredictions(): number[] {
    return this.sorties.slice(DonneesService.DONNEES_ENTRAINEMENT);
  }

  public denormaliserSorties(sorties: Tensor<Rank.R2>): number[] {
    return sorties.argMax(-1).arraySync() as number[];
  }

  private filtrerDonnees(donnees: Array<DonneesCoursVagues>) {
    return donnees.filter(d => d.nbVagues !== undefined && d.nbVagues !== null);
  }

  private normaliser(donnees: Array<Array<number>>) {
    const min = Math.min(...donnees.map(liste => Math.min(...liste)));
    const max = Math.max(...donnees.map(liste => Math.max(...liste)));
    return {min, max, donneesNormalisees: donnees.map(liste => liste.map(valeur => (valeur - min) / (max - min)))};
  }

  private classifier(sorties: Array<number>): Array<Array<number>> {
    const max = Math.max(...sorties);
    return sorties.map(sortie => {
      const resultat = new Array(max + 1);
      resultat[sortie] = 1;
      return resultat;
    });
  }
}
