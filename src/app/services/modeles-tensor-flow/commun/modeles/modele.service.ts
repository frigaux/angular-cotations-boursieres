import {Injectable} from '@angular/core';
import {DTOModele} from './dto-modele.interface';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {CouchesService} from '../couches/couches.service';
import {DTOOptimiseur} from './dto-optimiseur';

@Injectable({
  providedIn: 'root',
})
export class ModeleService {
  constructor(private couchesService: CouchesService) {
  }

  modele(modele: LayersModel): DTOModele {
    const optimiseur = this.optimiseur(modele);
    const fonctionsPerte = modele.lossFunctions.map(lossFunction => lossFunction.name);
    const metriques = modele.metricsNames
      .filter(metric => metric !== 'loss');
    const couches = this.couchesService.couches(modele);
    return {optimiseur, fonctionsPerte, metriques, couches};
  }

  private optimiseur(modele: LayersModel): DTOOptimiseur {
    const optimizer: any = modele.optimizer;
    const nom = optimizer.getClassName();
    const parametres: Array<{ nom: string, valeur: number }> = Object.keys(optimizer)
      .filter(cle => typeof optimizer[cle] === 'number')
      .map(cle => ({nom: cle, valeur: optimizer[cle]}));
    return {nom, parametres};
  }
}
