import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';

export class Alerte {
  alerte: DTOAlerte;
  evaluation: boolean;

  constructor(private alerte_: DTOAlerte, private evaluation_: boolean) {
    this.alerte = alerte_;
    this.evaluation = evaluation_;
  }
}
