import {DTOCoursTickerAllege} from './dto-cours-ticker-allege.interface';

export interface DtoCoursAvecListeAllege {
  ticker: string;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  alerte: boolean;
  cours: DTOCoursTickerAllege[];
}
