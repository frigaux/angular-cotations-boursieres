import {DTOActualiteTicker} from './dto-actualite-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTORatios} from './dto-ratios.class';
import {DTOCotations} from './dto-cotations.interface';

export class DTOInformationsTickerABCBourse {
  ticker: string;
  cotations?: DTOCotations;
  ratios: DTORatios;
  actualites: Array<DTOActualiteTicker>;
  variations: Array<DTOVariation>;
  dividendes: Array<DTODividende>;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.ratios = new DTORatios();
    this.actualites = [];
    this.variations = [];
    this.dividendes = [];
  }
}
