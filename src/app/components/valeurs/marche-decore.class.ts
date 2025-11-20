import {TranslateService} from '@ngx-translate/core';
import {Marches} from '../../services/valeurs/marches.enum';
import {ValeurDecore} from './valeur-decore.class';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';

export class MarcheDecore {
  libelle: string;
  valeurs: ValeurDecore[];

  constructor(private marche: Marches, private translateService: TranslateService, private liste: DTOValeur[]) {
    this.libelle = this.translateService.instant('ENUMERATIONS.MARCHE.' + marche);
    this.valeurs = liste.map(dto => new ValeurDecore(dto, this.libelle));
  }
}
