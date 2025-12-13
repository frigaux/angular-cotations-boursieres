import {Injectable} from '@angular/core';
import {IterateurDonnees} from './iterateur-donnees.class';

@Injectable({
  providedIn: 'root',
})
export class DonneesService {
  public static readonly NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE: number = 28;
  public static readonly CANAL_NOIR_BLANC = 1;
  public static readonly NOMBRE_PIXELS_IMAGE: number = Math.pow(DonneesService.NOMBRE_PIXELS_LARGEUR_HAUTEUR_IMAGE, 2); // nombre neurones en entrée
  public static readonly CHIFFRES_DISTINCTS: number = 10; // nombre neurones en sortie

  private static readonly NOMBRES_IMAGES: number = 65000;
  public static readonly NOMBRE_IMAGES_ENTRAINEMENT: number = 55000;
  public static readonly NOMBRE_IMAGES_PREDICTIONS: number = DonneesService.NOMBRES_IMAGES - DonneesService.NOMBRE_IMAGES_ENTRAINEMENT;

  private static readonly URL_MNIST_65000_IMAGES_DE_784PX: string =
    'http://fabienrigaux.freeboxos.fr/ml/mnist_images.png';
  private static readonly URL_MNIST_BOOLEEN_PAR_CHIFFRE_PAR_IMAGE: string =
    'http://fabienrigaux.freeboxos.fr/ml/mnist_labels_uint8';


  private images(): Promise<Float32Array> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = '';
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;

        const datasetBytesBuffer =
          new ArrayBuffer(DonneesService.NOMBRES_IMAGES * DonneesService.NOMBRE_PIXELS_IMAGE * 4);

        const chunkSize = 5000; // découpage pour un canvas de taille raisonnable
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = chunkSize;

        const ctx = canvas.getContext('2d');
        for (let i = 0; i < DonneesService.NOMBRES_IMAGES / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
            datasetBytesBuffer, i * DonneesService.NOMBRE_PIXELS_IMAGE * chunkSize * 4,
            DonneesService.NOMBRE_PIXELS_IMAGE * chunkSize);
          ctx!.drawImage(img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width, chunkSize);

          const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);

          for (let j = 0; j < imageData.data.length / 4; j++) {
            // un seul canal de couleur : noir et blanc
            datasetBytesView[j] = imageData.data[j * 4] / 255;
          }
        }
        resolve(new Float32Array(datasetBytesBuffer));
      };
      img.src = DonneesService.URL_MNIST_65000_IMAGES_DE_784PX;
    });
  }

  private chiffres(): Promise<Uint8Array> {
    return new Promise(resolve => {
      fetch(DonneesService.URL_MNIST_BOOLEEN_PAR_CHIFFRE_PAR_IMAGE)
        .then(reponse => {
          reponse.arrayBuffer().then(buffer => resolve(new Uint8Array(buffer)))
        });
    });
  }

  donneesImagesChiffres(): Promise<IterateurDonnees> {
    return new Promise(resolve => {
      Promise.all([this.images(), this.chiffres()])
        .then(([images, chiffres]) => {
          resolve(new IterateurDonnees(images, chiffres));
        });
    });
  }
}
