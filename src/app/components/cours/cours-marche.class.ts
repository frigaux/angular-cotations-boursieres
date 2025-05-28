import {TranslateService} from '@ngx-translate/core';
import {Marche} from '../../services/valeurs/marche.enum';
import {Cours} from './cours.class';

export class CoursMarche {
  libelle!: string;
  cours!: Cours[];

  constructor(private marche: Marche, private translateService: TranslateService, private liste: Cours[]) {
    this.libelle = this.translateService.instant('ENUMERATIONS.MARCHE.' + marche);
    this.cours = liste;
  }
}
