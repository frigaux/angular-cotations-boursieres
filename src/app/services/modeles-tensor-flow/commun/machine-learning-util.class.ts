import {Donnees} from '../tutoriels/regression-supervisee/donnees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';
import {DonneesNormalisees} from '../tutoriels/regression-supervisee/donnees-normalisees.interface';
import {Tensor} from '@tensorflow/tfjs-core';

export class MachineLearningUtil {
  static normaliserZeroAUn(donnees: Donnees<Rank.R2>): DonneesNormalisees {
    const entreesMin = donnees.entrees.min();
    const entreesMax = donnees.entrees.max();
    const sortiesMin = donnees.sorties.min();
    const sortiesMax = donnees.sorties.max();

    const entreesNormalisees = donnees.entrees.sub(entreesMin).div(entreesMax.sub(entreesMin));
    const sortiesNormalisees = donnees.sorties.sub(sortiesMin).div(sortiesMax.sub(sortiesMin));
    return {
      entrees: entreesNormalisees,
      sorties: sortiesNormalisees,
      entreesMin,
      entreesMax,
      sortiesMin,
      sortiesMax,
    }
  }

  static libererTenseursDans(...objets: Array<Object>) {
    objets.forEach(objet => {
      Object.values(objet)
        .filter(obj => obj instanceof Tensor)
        .forEach(tensor => tensor.dispose());
    });
  }

  static calculerMMG(donnees: number[], nbJours: number): number[] {
    const mmg = [];
    for (let i = 0; i < donnees.length - nbJours + 1; i++) {
      let somme = 0;
      for (let j = 0; j < nbJours; j++) {
        somme += donnees[i + j];
      }
      mmg.push(Math.round(100 * somme / nbJours) / 100);
    }
    return mmg;
  }

  static calculerVariations(donnees: number[]): number[] {
    const variations: number[] = [];
    for (let i = 1; i < donnees.length; i++) {
      // variations.push(Math.round(100 * donnees[i] / donnees[i - 1]) / 100);
      if (donnees[i] !== 0 && donnees[i - 1] !== 0) {
        variations.push(donnees[i] / donnees[i - 1]);
      } else {
        variations.push(1);
      }
    }
    return variations;
  }
}
