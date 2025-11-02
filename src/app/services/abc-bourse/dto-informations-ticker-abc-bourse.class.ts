import {DTOActualiteTicker} from './dto-actualite-ticker.class';
import {DTODividendeTicker} from './dto-dividende-ticker.class';
import {DTOVariationTicker} from './dto-variation-ticker.class';
import {DTORatios} from './dto-ratios.class';
import {DTOCotations} from './dto-cotations.interface';

export class DTOInformationsTickerABCBourse {
  ticker: string;
  cotations?: DTOCotations;
  ratios: DTORatios;
  actualites: Array<DTOActualiteTicker>;
  variations: Array<DTOVariationTicker>;
  dividendes: Array<DTODividendeTicker>;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.ratios = new DTORatios();
    this.actualites = [];
    this.variations = [];
    this.dividendes = [];
  }
}
