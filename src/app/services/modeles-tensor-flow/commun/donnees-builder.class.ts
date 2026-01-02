import {MachineLearningUtil} from './machine-learning-util.class';

export class DonneesBuilder {
  donnees: number[];
  nbJours?: number;
  variation?: boolean;

  constructor(donnees: number[]) {
    this.donnees = donnees;
  }

  calculerMMG(nbJours: number) {
    this.nbJours = nbJours;
    return this;
  }

  calculerVariation() {
    this.variation = true;
    return this;
  }

  build(): Array<number> {
    let donnees = this.donnees;
    if (this.nbJours) {
      donnees = MachineLearningUtil.calculerMMG(donnees, this.nbJours);
    }
    if (this.variation) {
      donnees = MachineLearningUtil.calculerVariations(donnees);
    }
    return donnees;
  }
}
