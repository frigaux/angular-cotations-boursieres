import {Neurone} from './neurone';

export interface CoucheDense {
  numero: number;
  fonctionActivation: string;
  neurones: Neurone[];
}
