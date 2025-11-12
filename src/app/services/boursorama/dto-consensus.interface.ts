import {DTOPrevision} from './dto-prevision.interface';
import {Conseil} from './conseil.enum';

export interface DTOConsensus {
  score: number;
  conseil?: Conseil;
  objectif3mois: number;
  pourcentagePotentiel: number;
  previsions: Array<DTOPrevision>;
}
