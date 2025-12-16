import {Couche} from './couche.interface';
import {Optimiseur} from './optimiseur';

export interface Modele {
  optimiseur: Optimiseur;
  fonctionsPerte: Array<string>;
  metriques: Array<string>;
  couches: Array<Couche>;
}
