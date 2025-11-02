import {TypeDividende} from './type-dividende.enum';

export interface DTODividende {
  date: string; // ISO 8601 : yyyy-MM-dd
  ticker: string;
  type: TypeDividende;
  montant: number;
  pourcentageRendement: number;
}
