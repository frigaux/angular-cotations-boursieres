import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {Neurone} from './neurone.interface';
import {Couche} from './couche.interface';
import {TypeCouche} from './type-couche';

@Injectable({
  providedIn: 'root',
})
export class CouchesService {
  private couchesDenses(modele: LayersModel): Array<Couche> {
    return modele.layers
      .filter((layer: any) => layer.getClassName?.() === 'Dense')
      .map((layer: any) => {
        const [kernel, bias] = layer.getWeights();
        const poidsNeurones = kernel.arraySync() as number[][];
        const biais = bias.arraySync() as number[];
        const neurones: Array<Neurone> = Array.from({length: biais.length}, (v, idxBiais) => {
          return {
            poids: Array.from({length: poidsNeurones.length}, (v, i) => poidsNeurones[i][idxBiais]),
            biais: biais[idxBiais]
          };
        });
        return {
          numero: layer.id,
          type: TypeCouche.DENSE,
          fonctionActivation: layer.activation.getClassName?.(),
          neurones
        };
      });
  }

  couches(modele: LayersModel): Array<Couche> {
    return this.couchesDenses(modele);
  }
}
