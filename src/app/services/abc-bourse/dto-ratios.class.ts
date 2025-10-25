import {DTOIndicateur} from './dto-ratio.class';

export class DTORatios {
  indicateurs: Array<DTOIndicateur>;
  variationCAC?: number;
  correlationCAC?: number;
  qualiteFinanciere?: string;

  constructor() {
    this.indicateurs = [];
  }
}
