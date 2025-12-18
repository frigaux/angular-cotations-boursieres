import {DTOCouche} from './dto-couche.interface';
import {DTOOptimiseur} from './dto-optimiseur';

export interface DTOModele {
  optimiseur: DTOOptimiseur;
  fonctionsPerte: Array<string>;
  metriques: Array<string>;
  couches: Array<DTOCouche>;
}
