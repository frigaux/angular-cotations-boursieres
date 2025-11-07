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
