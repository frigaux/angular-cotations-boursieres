import {DTOJobExecutionParam} from './dto-job-execution-param.interface';
import {DTOStepExecution} from './dto-step-execution.interface';

export interface DTOJobExecution {
  creation: string;  // ISO 8601 : yyyy-MM-ddTHH:mm:ss.SSSSSSZ
  debut: string;  // ISO 8601 : yyyy-MM-ddTHH:mm:ss.SSSSSSZ
  fin: string;  // ISO 8601 : yyyy-MM-ddTHH:mm:ss.SSSSSSZ
  statut: string;
  message?: string;
  parametres: DTOJobExecutionParam[];
  etapes: DTOStepExecution[];
}
