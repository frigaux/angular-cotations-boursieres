import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';

export const PORTEFEUILLE: Array<DTOPortefeuille> = [
  {nom: 'Spéculation', parDefaut: true, tickers: ['GLE'], alertes: []}
];

export const PORTEFEUILLES: Array<DTOPortefeuille> = [
  {nom: 'Spéculation', parDefaut: true, tickers: ['GLE', 'BNP'], alertes: [{nom: 'MM-5-10', condition: 'C1 < M5 && C1 < M10'}]},
  {nom: 'CAC40', parDefaut: false, tickers: [], alertes: []}
];
