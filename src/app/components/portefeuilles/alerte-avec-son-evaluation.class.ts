import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';

export class AlerteAvecSonEvaluation {
  id: number;
  alerte: DTOAlerte;
  evaluation: boolean;

  constructor(id: number, alerte: DTOAlerte, evaluation: boolean) {
    this.id = id;
    this.alerte = alerte;
    this.evaluation = evaluation;
  }
}
