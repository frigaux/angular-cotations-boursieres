import * as tf from '@tensorflow/tfjs';
import {DonneesService} from './donnees.service';

export class Donnees {
  private shuffledTrainIndex: number = 0;
  private shuffledTestIndex: number = 0;
  private trainIndices: any;
  private testIndices: any;
  private trainImages: any;
  private testImages: any;
  private trainLabels: any;
  private testLabels: any;

  constructor(datasetImages: Float32Array, datasetLabels: Uint8Array) {
    // Create shuffled indices into the train/test set for when we select a
    // random dataset element for training / validation.
    this.trainIndices = tf.util.createShuffledIndices(DonneesService.NUM_TRAIN_ELEMENTS);
    this.testIndices = tf.util.createShuffledIndices(DonneesService.NUM_TEST_ELEMENTS);

    // Slice the the images and labels into train and test sets.
    this.trainImages =
      datasetImages.slice(0, DonneesService.IMAGE_SIZE * DonneesService.NUM_TRAIN_ELEMENTS);
    this.testImages = datasetImages.slice(DonneesService.IMAGE_SIZE * DonneesService.NUM_TRAIN_ELEMENTS);
    this.trainLabels =
      datasetLabels.slice(0, DonneesService.NUM_CLASSES * DonneesService.NUM_TRAIN_ELEMENTS);
    this.testLabels =
      datasetLabels.slice(DonneesService.NUM_CLASSES * DonneesService.NUM_TRAIN_ELEMENTS);

  }

  public nextTrainBatch(batchSize: number) {
    return this.nextBatch(
      batchSize, [this.trainImages, this.trainLabels], () => {
        this.shuffledTrainIndex =
          (this.shuffledTrainIndex + 1) % this.trainIndices.length;
        return this.trainIndices[this.shuffledTrainIndex];
      });
  }

  public nextTestBatch(batchSize: number) {
    return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
      this.shuffledTestIndex =
        (this.shuffledTestIndex + 1) % this.testIndices.length;
      return this.testIndices[this.shuffledTestIndex];
    });
  }

  private nextBatch(batchSize: number, data: any, index: any) {
    const batchImagesArray = new Float32Array(batchSize * DonneesService.IMAGE_SIZE);
    const batchLabelsArray = new Uint8Array(batchSize * DonneesService.NUM_CLASSES);

    for (let i = 0; i < batchSize; i++) {
      const idx = index();

      const image =
        data[0].slice(idx * DonneesService.IMAGE_SIZE, idx * DonneesService.IMAGE_SIZE + DonneesService.IMAGE_SIZE);
      batchImagesArray.set(image, i * DonneesService.IMAGE_SIZE);

      const label =
        data[1].slice(idx * DonneesService.NUM_CLASSES, idx * DonneesService.NUM_CLASSES + DonneesService.NUM_CLASSES);
      batchLabelsArray.set(label, i * DonneesService.NUM_CLASSES);
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, DonneesService.IMAGE_SIZE]);
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, DonneesService.NUM_CLASSES]);

    return {xs, labels};
  }
}
