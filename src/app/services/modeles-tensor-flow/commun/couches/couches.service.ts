import {Injectable} from '@angular/core';
import {LayersModel} from '@tensorflow/tfjs-layers/dist/engine/training';
import {DTONeurone} from './dto-neurone.interface';
import {DTOCouche} from './dto-couche.interface';
import {TypeCouche} from './type-couche.enum';
import {DTOCoucheDense} from './dto-couche-dense.class';
import {DTOCoucheConv2D} from './dto-couche-conv2d.class';
import {DTONeurone2d} from './dto-neurone2d.interface';
import {DTOCoucheMaxPooling2D} from './dto-couche-max-pooling2d.class';
import {DTOCoucheReshape} from './dto-couche-reshape.class';
import {DTOCoucheConv1D} from './dto-couche-conv1d.class';
import {DTOCoucheMaxPooling1D} from './dto-couche-max-pooling1d.class';

@Injectable({
  providedIn: 'root',
})
export class CouchesService {
  private coucheDense(layer: any): DTOCoucheDense {
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

  private coucheConvolution2D(layer: any): DTOCoucheConv2D {
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
    return new DTOCoucheConv2D(layer.id,
      layer.activation.getClassName?.(),
      layer.kernelInitializer.getClassName?.(),
      neurones,
      layer.strides);
  }

  private coucheMaxPooling2D(layer: any): DTOCoucheMaxPooling2D {
    return new DTOCoucheMaxPooling2D(layer.id, layer.poolSize, layer.strides);
  }

  private coucheFlatten(layer: any): DTOCouche {
    return {
      numero: layer.id,
      type: TypeCouche.FLATTEN
    };
  }

  private coucheReshape(layer: any): DTOCoucheReshape {
    return new DTOCoucheReshape(layer.id, layer.targetShape);
  }

  private coucheConvolution1D(layer: any): DTOCoucheConv1D {
    const [kernel, bias] = layer.getWeights();
    const poidsNeurones = kernel.arraySync() as number[][][];
    const biais = bias.arraySync() as number[];
    const neurones: Array<DTONeurone> = Array.from({length: biais.length}, (v, idxBiais) => {
      return {
        poids: Array.from({length: poidsNeurones.length}, (v, i) => poidsNeurones[i][0][idxBiais]),
        biais: biais[idxBiais]
      };
    });
    return new DTOCoucheConv1D(layer.id,
      layer.activation.getClassName?.(),
      layer.kernelInitializer.getClassName?.(),
      neurones,
      layer.strides);
  }

  private coucheMaxPooling1D(layer: any): DTOCoucheMaxPooling1D {
    return new DTOCoucheMaxPooling1D(layer.id, layer.poolSize, layer.strides);
  }

  couches(modele: LayersModel): Array<DTOCouche> {
    return modele.layers
      .filter((layer: any) => layer.getClassName?.() !== 'InputLayer')
      .map((layer: any) => {
          switch (layer.getClassName?.()) {
            case 'Dense':
              return this.coucheDense(layer);
            case 'Conv2D':
              return this.coucheConvolution2D(layer);
            case 'MaxPooling2D':
              return this.coucheMaxPooling2D(layer);
            case 'Flatten':
              return this.coucheFlatten(layer);
            case 'Reshape':
              return this.coucheReshape(layer);
            case 'Conv1D':
              return this.coucheConvolution1D(layer);
            case 'MaxPooling1D':
              return this.coucheMaxPooling1D(layer);
            default:
              throw new Error(`Couche non gérée ${layer.getClassName?.()}`);
          }
        }
      );
  }
}
