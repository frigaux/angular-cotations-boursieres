import {DTOInformationTicker} from './dto-information-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTORatio} from './dto-ratio.class';

export class DTOInformationsTicker {
  ticker: string;
  informations: Array<DTOInformationTicker>;
  variations: Array<DTOVariation>;
  dividendes: Array<DTODividende>;
  ratios: Array<DTORatio>;
  variationCAC?: number;
  correlationCAC?: number;
  qualiteFinanciere?: string;

  constructor(ticker: string) {
    this.ticker = ticker;
    this.informations = [];
    this.variations = [];
    this.dividendes = [];
    this.ratios = [];
  }
}
