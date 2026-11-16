import {DTOPreviousBourseDirect} from './dto-previous-bourse-direct';
import {DtoCurrentBourseDirect} from './dto-current-bourse-direct';

export interface DTOCotationsBourseDirect {
  date: string; // ISO 8601 : yyyy-MM-ddTHH:mm:ss+HH:mm
  previous: DTOPreviousBourseDirect;
  current: DtoCurrentBourseDirect[];
}
