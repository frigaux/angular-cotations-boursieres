import {Component, OnInit} from '@angular/core';
import {
  FormulaireUrlSauvegardeRestaurationComponent
} from './formulaire-url-sauvegarde-restauration/formulaire-url-sauvegarde-restauration.component';
import {ParametrageService} from '../../../services/parametrage/parametrage.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LoaderComponent} from '../../loader/loader.component';
import {JsonPipe} from '@angular/common';
import {DialogSauvegarde} from './dialog-sauvegarde/dialog-sauvegarde.component';
import {DialogRestauration} from './dialog-restauration/dialog-restauration.component';
import {DTORestauration} from './dialog-restauration/dto-restauration.class';

@Component({
  selector: 'app-sauvegarde-restauration',
  imports: [
    FormulaireUrlSauvegardeRestaurationComponent,
    TranslatePipe,
    LoaderComponent,
    JsonPipe,
    DialogSauvegarde,
    DialogRestauration
  ],
  templateUrl: './sauvegarde-restauration.component.html',
  styleUrl: './sauvegarde-restauration.component.sass'
})
export class SauvegardeRestaurationComponent implements OnInit {

  // données pour la vue
  afficherFormulaireUrlSauvegardeRestauration: boolean = false;
  loading: boolean = false;
  succes?: string;
  httpResponseError?: any;
  dialogSauvegardeVisible: boolean = false;
  dialogRestaurationVisible: boolean = false;

  constructor(private translateService: TranslateService,
              private parametrageService: ParametrageService) {
  }

  ngOnInit(): void {
    if (this.parametrageService.chargerUrlSauvegardeRestauration() == undefined) {
      this.afficherFormulaireUrlSauvegardeRestauration = true;
    }
  }

  sauvegarder() {
    this.loading = true;
    this.httpResponseError = undefined;
    this.succes = undefined;
    this.parametrageService.sauvegarder().subscribe({
      error: httpResponseError => {
        this.httpResponseError = httpResponseError;
        this.loading = false;
      },
      next: () => {
        this.succes = this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.SAUVEGARDE_REUSSI');
        this.loading = false;
      }
    });
  }

  restaurer(dtoRestauration: DTORestauration) {
    this.loading = true;
    this.httpResponseError = undefined;
    this.succes = undefined;
    this.parametrageService.restaurer(dtoRestauration).subscribe({
      error: httpResponseError => {
        this.httpResponseError = httpResponseError;
        this.loading = false;
      },
      next: () => {
        this.succes = this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.RESTAURATION_REUSSIE');
        this.loading = false;
      }
    });
  }
}
