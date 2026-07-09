import {DTODividendes} from '../dividendes/dto-dividendes.class';
import {TypeDividende} from '../dividendes/type-dividende.enum';

export const DIVIDENDES_TICKER_GLE: DTODividendes = {
  dateRecuperation: new Date().toISOString().substring(0, 10),
  dividendes: [{
    date: "2025-10-07",
    ticker: 'GLE',
    type: TypeDividende.DETACHEMENT_ACOMPTE,
    montant: 0.61,
    pourcentageRendement: 0.011200000000000002
  }]
};

export const DIVIDENDES_BY_TICKER: any = new Map([
  [
    "GLE",
    [
      {
        "date": "2025-10-07",
        "ticker": "GLE",
        "type": "détachement (acompte)",
        "montant": 0.61,
        "pourcentageRendement": 0.0086
      },
      {
        "date": "2025-05-26",
        "ticker": "GLE",
        "type": "détachement",
        "montant": 1.09,
        "pourcentageRendement": 0.0154
      }
    ]
  ],
  [
    "BNP",
    [
      {
        "date": "2025-09-26",
        "ticker": "BNP",
        "type": "détachement (acompte)",
        "montant": 2.59,
        "pourcentageRendement": 0.0296
      },
      {
        "date": "2025-05-19",
        "ticker": "BNP",
        "type": "détachement",
        "montant": 4.79,
        "pourcentageRendement": 0.0548
      }
    ]
  ]
]);
