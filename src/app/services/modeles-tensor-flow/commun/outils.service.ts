import {Injectable} from '@angular/core';
import {Donnees} from '../tutoriels/regression-supervisee/donnees.interface';
import {Rank} from '@tensorflow/tfjs-core/dist/types';
import {DonneesNormalisees} from '../tutoriels/regression-supervisee/donnees-normalisees.interface';
import {Tensor} from '@tensorflow/tfjs-core';

@Injectable({
  providedIn: 'root',
})
export class OutilsService {
  normaliserZeroAUn(donnees: Donnees<Rank.R2>): DonneesNormalisees {
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

  libererTenseursDans(...objets: Array<Object>) {
    objets.forEach(objet => {
      Object.values(objet)
        .filter(obj => obj instanceof Tensor)
        .forEach(tensor => tensor.dispose());
    });
  }
}
