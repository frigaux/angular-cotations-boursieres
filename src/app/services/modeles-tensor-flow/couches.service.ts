import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {DTONeurone} from './dto-neurone.interface';
import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';
import {DTOCoucheDense} from './dto-couche-dense.class';
import {DTOCoucheConv2d} from './dto-couche-conv2d.class';
import {DTONeurone2d} from './dto-neurone2d.interface';
import {DTOCoucheMaxpooling2d} from './dto-couche-pooling2d.class';

@Injectable({
  providedIn: 'root',
})
export class CouchesService {
  private couchesDenses(layer: any): DTOCoucheDense {
    const [kernel, bias] = layer.getWeights();
    const poidsNeurones = kernel.arraySync() as number[][];
    const biais = bias.arraySync() as number[];
    const neurones: Array<DTONeurone> = Array.from({length: biais.length}, (v, idxBiais) => {
      return {
        poids: Array.from({length: poidsNeurones.length}, (v, i) => poidsNeurones[i][idxBiais]),
        biais: biais[idxBiais]
      };
    });
    return new DTOCoucheDense(layer.id,
      layer.activation.getClassName?.(),
      layer.kernelInitializer.getClassName?.(),
      neurones);
  }

  private couchesConvolution2D(layer: any): DTOCoucheConv2d {
    const [kernel, bias] = layer.getWeights();
    const poidsNeurones = kernel.arraySync() as number[][][][];
    const biais = bias.arraySync() as number[];
    const neurones: Array<DTONeurone2d> = Array.from({length: biais.length}, (v, idxBiais) => {
      return {
        poids: Array.from({length: poidsNeurones.length}, (v, i) =>
          Array.from({length: poidsNeurones[i].length}, (v, j) => poidsNeurones[i][j][0][idxBiais]
          )
        ),
        biais: biais[idxBiais]
      };
    });
    return new DTOCoucheConv2d(layer.id,
      layer.activation.getClassName?.(),
      layer.kernelInitializer.getClassName?.(),
      neurones,
      layer.strides);
  }

  private couchesMaxPooling2D(layer: any): DTOCoucheMaxpooling2d {
    return new DTOCoucheMaxpooling2d(layer.id, layer.poolSize, layer.strides);
  }

  private couchesFlatten(layer: any): DTOCouche {
    return {
      numero: layer.id,
      type: TypeCouche.FLATTEN
    };
  }

  couches(modele: LayersModel): Array<DTOCouche> {
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
