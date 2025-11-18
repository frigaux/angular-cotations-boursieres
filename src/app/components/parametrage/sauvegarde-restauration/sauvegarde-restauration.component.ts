import {Component, input, InputSignal, OnInit} from '@angular/core';
import {
  FormulaireUrlSauvegardeRestaurationComponent
} from './formulaire-url-sauvegarde-restauration/formulaire-url-sauvegarde-restauration.component';
import {ParametrageService} from '../../../services/parametrage/parametrage.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {LoaderComponent} from '../../loader/loader.component';
import {JsonPipe} from '@angular/common';
import {DialogSauvegardeComponent} from './dialog-sauvegarde/dialog-sauvegarde.component';
import {DialogRestaurationComponent} from './dialog-restauration/dialog-restauration.component';
import {DTORestauration} from '../../../services/parametrage/dto-restauration.class';
import {HttpErrorResponse} from '@angular/common/http';
import {CoursPortefeuille} from '../../portefeuilles/cours-portefeuille.class';

@Component({
  selector: 'app-sauvegarde-restauration',
  imports: [
    FormulaireUrlSauvegardeRestaurationComponent,
    TranslatePipe,
    LoaderComponent,
    JsonPipe,
    DialogSauvegardeComponent,
    DialogRestaurationComponent
  ],
  templateUrl: './sauvegarde-restauration.component.html',
  styleUrl: './sauvegarde-restauration.component.sass'
})
export class SauvegardeRestaurationComponent implements OnInit {
  // input/output
  inputPetit: InputSignal<boolean | undefined> = input(undefined,
    {transform: o => this.intercepteurPetit(o), alias: 'petit'});

  // données pour la vue
  afficherFormulaireUrlSauvegardeRestauration: boolean = false;
  loading: boolean = false;
  succes?: string;
  httpErrorResponse?: HttpErrorResponse;
  dialogSauvegardeVisible: boolean = false;
  dialogRestaurationVisible: boolean = false;
  petit?: boolean;

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
    this.httpErrorResponse = undefined;
    this.succes = undefined;
    this.parametrageService.sauvegarder().subscribe({
      error: httpErrorResponse => {
        this.httpErrorResponse = httpErrorResponse;
        this.loading = false;
      },
      next: () => {
        this.succes = this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.SAUVEGARDE_REUSSI');
        setTimeout(() => this.succes = undefined, 2000);
        this.loading = false;
      }
    });
  }

  restaurer(dtoRestauration: DTORestauration) {
    this.loading = true;
    this.httpErrorResponse = undefined;
    this.succes = undefined;
    this.parametrageService.restaurer(dtoRestauration).subscribe({
      error: httpErrorResponse => {
        this.httpErrorResponse = httpErrorResponse;
        this.loading = false;
      },
      next: () => {
        this.succes = this.translateService.instant('COMPOSANTS.PARAMETRAGE.SAUVEGARDE_RESTAURATION.RESTAURATION_REUSSIE');
        setTimeout(() => this.succes = undefined, 2000);
        this.loading = false;
      }
    });
  }

  private intercepteurPetit(petit: boolean | undefined) {
    this.petit = petit;
    return petit;
  }
}
