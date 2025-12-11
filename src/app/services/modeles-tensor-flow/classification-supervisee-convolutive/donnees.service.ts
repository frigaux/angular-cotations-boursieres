import {Injectable} from '@angular/core';
import {Donnees} from './donnees.class';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {
  public static readonly IMAGE_SIZE: number = 784;
  public static readonly NUM_CLASSES: number = 10;
  private static readonly NUM_DATASET_ELEMENTS: number = 65000;

  public static readonly NUM_TRAIN_ELEMENTS: number = 55000;
  public static readonly NUM_TEST_ELEMENTS: number = DonneesService.NUM_DATASET_ELEMENTS - DonneesService.NUM_TRAIN_ELEMENTS;

  private static readonly MNIST_IMAGES_SPRITE_PATH: string =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
  private static readonly MNIST_LABELS_PATH: string =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';


  private datasetImages(): Promise<Float32Array> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = '';
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;

        const datasetBytesBuffer =
          new ArrayBuffer(DonneesService.NUM_DATASET_ELEMENTS * DonneesService.IMAGE_SIZE * 4);

        const chunkSize = 5000;
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = chunkSize;

        const ctx = canvas.getContext('2d');
        for (let i = 0; i < DonneesService.NUM_DATASET_ELEMENTS / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
            datasetBytesBuffer, i * DonneesService.IMAGE_SIZE * chunkSize * 4,
            DonneesService.IMAGE_SIZE * chunkSize);
          ctx!.drawImage(
            img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
            chunkSize);

          const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

          for (let j = 0; j < imageData.data.length / 4; j++) {
            // All channels hold an equal value since the image is grayscale, so
            // just read the red channel.
            datasetBytesView[j] = imageData.data[j * 4] / 255;
          }
        }
        resolve(new Float32Array(datasetBytesBuffer));
      };
      img.src = DonneesService.MNIST_IMAGES_SPRITE_PATH;
    });
  }

  private datasetLabels(): Promise<Uint8Array> {
    return new Promise(resolve => {
      fetch(DonneesService.MNIST_LABELS_PATH)
        .then(reponse => {
          reponse.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)))
        });
    });
  }

  donneesImagesLibelles(): Promise<Donnees> {
    return new Promise(resolve => {
      Promise.all([this.datasetImages(), this.datasetLabels()])
        .then(([datasetImages, datasetLabels]) => {
          resolve(new Donnees(datasetImages, datasetLabels));
        });
    });
  }
}
