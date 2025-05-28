import {TranslateService} from '@ngx-translate/core';
import {Marche} from '../../services/valeurs/marche.enum';
import {Valeur} from './valeur.class';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';

export class ValeurMarche {
  libelle!: string;
  valeurs!: Valeur[];

  constructor(private marche: Marche, private translateService: TranslateService, private liste: DTOValeur[]) {
    this.libelle = this.translateService.instant('ENUMERATIONS.MARCHE.' + marche);
    this.valeurs = liste.map(dto => new Valeur(dto, this.libelle));
  }
}
