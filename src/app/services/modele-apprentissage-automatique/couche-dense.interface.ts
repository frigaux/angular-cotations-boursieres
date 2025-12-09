import {Neurone} from './neurone';

export interface CoucheDense {
  nom: string;
  fonctionActivation: string;
  neurones: Neurone[];
}
