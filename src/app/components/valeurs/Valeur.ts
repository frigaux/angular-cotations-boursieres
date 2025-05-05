import {DTOValeur} from '../../services/valeurs/DTOValeur';
import {TranslateService, _} from "@ngx-translate/core";

export class Valeur {
  ticker!: string;
  marche!: string;
  libelle!: string;

  constructor(private dto: DTOValeur, private translateService: TranslateService) {
    this.ticker = dto.ticker;
    this.marche = this.translateService.instant('ENUMERATIONS.MARCHE.' + dto.marche);
    this.libelle = dto.libelle;
  }
}
