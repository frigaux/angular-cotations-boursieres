import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';

export const PORTEFEUILLE: DTOPortefeuille = {
  nom: 'Spéculation',
  parDefaut: true,
  tickers: ['GLE', 'BNP'],
  alertes: [
    {nom: 'Remontée', condition: 'M20 > M10 && M10 > M5 && C2 < (0.98 * C1)'},
    {
      nom: 'Chute',
      condition: 'M20 < M10 && M10 < M5 && C2 > (1.02 * C1)'
    },
    {nom: 'Grosse variation veille', condition: 'C2 < 0.98 * C1 || C2 > 1.02 * C1'}
  ]
};

export const PORTEFEUILLES: Array<DTOPortefeuille> = [
  PORTEFEUILLE,
  {nom: 'CAC40', parDefaut: false, tickers: [], alertes: []}
];
