import {Portefeuille} from '../../components/portefeuilles/gestion-portefeuilles/portefeuille.interface';

export const PORTEFEUILLE: Array<Portefeuille> = [
  {nom: 'Spéculation', parDefaut: true, tickers: ['GLE'], alertes: []}
];

export const PORTEFEUILLES: Array<Portefeuille> = [
  {nom: 'Spéculation', parDefaut: true, tickers: ['GLE', 'BNP'], alertes: [{nom: 'MM-5-10', condition: ''}]},
  {nom: 'CAC40', parDefaut: false, tickers: [], alertes: []}
];
