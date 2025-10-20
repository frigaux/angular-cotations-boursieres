import {Component, OnInit} from '@angular/core';
import {
  FormulaireUrlSauvegardeRestaurationComponent
} from './formulaire-url-sauvegarde-restauration/formulaire-url-sauvegarde-restauration.component';
import {ParametrageService} from '../../../services/parametrage/parametrage.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {ConfirmationService} from 'primeng/api';
import {LoaderComponent} from '../../loader/loader.component';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-sauvegarde-restauration',
  imports: [
    FormulaireUrlSauvegardeRestaurationComponent,
    TranslatePipe,
    LoaderComponent,
    JsonPipe
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

  constructor(private translateService: TranslateService,
              private parametrageService: ParametrageService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  ngOnInit(): void {
    if (this.parametrageService.chargerUrlSauvegardeRestauration() == undefined) {
      this.afficherFormulaireUrlSauvegardeRestauration = true;
    }
  }

  sauvegarde(event: PointerEvent) {
    this.dialogueService.confirmation(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.CONFIRMATION_SAUVEGARDE'),
      () => {
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
      },
      'COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.SAUVEGARDER'
    );
  }

  restauration(event: PointerEvent) {
    this.dialogueService.confirmation(
      this.confirmationService,
      event,
      this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.CONFIRMATION_RESTAURATION'),
      () => {
        this.loading = true;
        this.httpResponseError = undefined;
        this.succes = undefined;
        this.parametrageService.restaurer().subscribe({
          error: httpResponseError => {
            this.httpResponseError = httpResponseError;
            this.loading = false;
          },
          next: () => {
            this.succes = this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.RESTAURATION_REUSSIE');
            this.loading = false;
          }
        });
      },
      'COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.RESTAURER'
    );
  }
}
