import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {CoucheDense} from './couche-dense.interface';
import {Neurone} from './neurone';

@Injectable({
  providedIn: 'root',
})
export class CouchesService {
  couchesDenses(modele: LayersModel): Array<CoucheDense> {
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
          fonctionActivation: layer.activation.getClassName?.(),
          neurones
        };
      });
  }
}
