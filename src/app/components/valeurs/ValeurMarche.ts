import {TranslateService} from '@ngx-translate/core';
import {Marche} from '../../services/valeurs/marche';
import {Valeur} from './Valeur';
import {DTOValeur} from '../../services/valeurs/DTOValeur';

export class ValeurMarche {
  libelle!: string;
  valeurs!: Valeur[];

  constructor(private marche: Marche, private translateService: TranslateService, private liste: DTOValeur[]) {
    this.libelle = this.translateService.instant('ENUMERATIONS.MARCHE.' + marche);
    this.valeurs = liste.map(dto => new Valeur(dto, this.libelle));
  }
}
