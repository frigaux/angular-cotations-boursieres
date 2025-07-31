import {DTOAchat} from './dto-achat.interface';

export interface DTOAchatsTicker {
  ticker: string;
  achats: Array<DTOAchat>;
}
