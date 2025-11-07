import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';

export class AlerteAvecSonEvaluation {
  alerte: DTOAlerte;
  evaluation: boolean;

  constructor(alerte: DTOAlerte, evaluation: boolean) {
    this.alerte = alerte;
    this.evaluation = evaluation;
  }
}
