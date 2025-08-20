import {DTOInformationTicker} from './dto-information-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTORatio} from './dto-ratio.class';

export class DTOInformationsTicker {
  ticker: string;
  informations: Array<DTOInformationTicker>;
  dividendes: Array<DTODividende>;
  variations: Array<DTOVariation>;
  ratios: Array<DTORatio>;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.informations = [];
    this.dividendes = [];
    this.variations = [];
    this.ratios = [];
  }
}
