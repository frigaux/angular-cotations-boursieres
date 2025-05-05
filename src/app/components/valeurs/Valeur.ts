import {DTOValeur} from '../../services/valeurs/DTOValeur';
import {TranslateService, _} from "@ngx-translate/core";

export class Valeur {
    ticker!: string;
    marche!: string;
    libelle!: string;

    constructor(private dto: DTOValeur, private translate: TranslateService) {
      this.ticker = dto.ticker;
      this.marche = this.translate.instant('ENUMERATIONS.MARCHE.' + dto.marche);
      this.libelle = dto.libelle;
    }
}
