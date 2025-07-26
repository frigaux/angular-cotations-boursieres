import {DTOCours} from './dto-cours.interface';

export interface DTOListeCours {
  date: string; // ISO 8601 : yyyy-MM-dd
  cours: DTOCours[];
}
