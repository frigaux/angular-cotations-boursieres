import {DTOActualiteTicker} from './dto-actualite-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTORatio} from './dto-ratio.class';

export class DTOInformationsTickerABCBourse {
  ticker: string;
  actualites: Array<DTOActualiteTicker>;
  variations: Array<DTOVariation>;
  dividendes: Array<DTODividende>;
  ratios: Array<DTORatio>;
  variationCAC?: number;
  correlationCAC?: number;
  qualiteFinanciere?: string;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.actualites = [];
    this.variations = [];
    this.dividendes = [];
    this.ratios = [];
  }
}
