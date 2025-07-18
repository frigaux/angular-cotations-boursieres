import {TranslateService} from '@ngx-translate/core';
import {Marches} from '../../services/valeurs/marches.enum';
import {Cours} from './cours.class';

export class CoursMarche {
  libelle!: string;
  cours!: Cours[];

  constructor(private marche: Marches, private translateService: TranslateService, private liste: Cours[]) {
    this.libelle = this.translateService.instant('ENUMERATIONS.MARCHE.' + marche);
    this.cours = liste;
  }
}
