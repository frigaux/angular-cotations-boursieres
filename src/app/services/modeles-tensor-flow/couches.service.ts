import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {Neurone} from './neurone.interface';
import {Couche} from './couche.interface';
import {TypeCouche} from './type-couche';

@Injectable({
  providedIn: 'root',
})
export class CouchesService {
  private couchesDenses(layer: any): Couche {
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
      fonctionInitialisationPoids: layer.kernelInitializer.getClassName?.(),
      neurones
    };
  }

  private couchesConvolution2D(layer: any): Couche {
    const [kernel, bias] = layer.getWeights();
    const poidsNeurones = kernel.arraySync() as number[][][][];
    const biais = bias.arraySync() as number[];
    const neurones: Array<Neurone> = Array.from({length: biais.length}, (v, idxBiais) => {
      return {
        poids2D: Array.from({length: poidsNeurones.length}, (v, i) =>
          Array.from({length: poidsNeurones[i].length}, (v, j) => poidsNeurones[i][j][0][idxBiais]
          )
        ),
        biais: biais[idxBiais]
      };
    });
    return {
      numero: layer.id,
      type: TypeCouche.CONV2D,
      fonctionActivation: layer.activation.getClassName?.(),
      fonctionInitialisationPoids: layer.kernelInitializer.getClassName?.(),
      neurones
    };
  }

  private couchesMaxPooling2D(layer: any): Couche {
    return {
      numero: layer.id,
      type: TypeCouche.MAXPOOLING2D,
      neurones: []
    };
  }

  private couchesFlatten(layer: any) {
    return {
      numero: layer.id,
      type: TypeCouche.FLATTEN,
      neurones: []
    };
  }

  couches(modele: LayersModel): Array<Couche> {
    return modele.layers
      .filter((layer: any) => layer.getClassName?.() !== 'InputLayer')
      .map((layer: any) => {
          switch (layer.getClassName?.()) {
            case 'Dense':
              return this.couchesDenses(layer);
            case 'Conv2D':
              return this.couchesConvolution2D(layer);
            case 'MaxPooling2D':
              return this.couchesMaxPooling2D(layer);
            case 'Flatten':
              return this.couchesFlatten(layer);
            default:
              throw new Error(`Couche non gérée ${layer.getClassName?.()}`);
          }
        }
      );
  }
}
