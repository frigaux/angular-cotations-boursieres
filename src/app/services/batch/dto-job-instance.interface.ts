import {DTOJobExecution} from './dto-job-execution.interface';

export interface DTOJobInstance {
  nom: string;
  executions: DTOJobExecution[];
}
