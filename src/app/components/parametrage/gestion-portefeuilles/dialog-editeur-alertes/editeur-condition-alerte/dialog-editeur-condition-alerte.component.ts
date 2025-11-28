import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AutoFocus} from 'primeng/autofocus';
import {DTOAlerte} from '../../../../../services/portefeuilles/dto-alerte.interface';
import {Card} from 'primeng/card';
import {PortefeuillesService} from '../../../../../services/portefeuilles/portefeuilles.service';

@Component({
  selector: 'app-dialog-editeur-condition-alerte',
  imports: [
    Dialog,
    Button,
    FloatLabel,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    TranslatePipe,
    AutoFocus,
    Card
  ],
  templateUrl: './dialog-editeur-condition-alerte.component.html',
  styleUrl: './dialog-editeur-condition-alerte.component.sass'
})
export class DialogEditeurConditionAlerteComponent {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  alerte: InputSignal<DTOAlerte | undefined> = input(undefined,
    {transform: o => this.intercepteurAlerte(o)});
  modifie = output<string>();
  abandon = output<void>();

  // formulaires
  formulaire = this.formBuilder.group({
    condition: ['', [Validators.required]]
  });

  //données pour la vue
  alerteEnModification: DTOAlerte | undefined;
  titre: string | undefined;
  erreur: string | undefined;

  constructor(private translateService: TranslateService,
              private portefeuillesService: PortefeuillesService) {
  }

  intercepteurAlerte(alerte: DTOAlerte | undefined) {
    this.alerteEnModification = alerte;
    if (this.alerteEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PARAMETRAGE.GESTION_PORTEFEUILLES.EDITEUR_ALERTES.EDITEUR_CONDITION_ALERTE.MODIFICATION_CONDITION', {'nom': this.alerteEnModification.nom});
      this.formulaire.get('condition')?.setValue(this.alerteEnModification.condition);
    }
    return alerte;
  }

  modifierConditionAlerte() {
    this.formulaire.get('condition')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.condition) {
      this.erreur = this.portefeuillesService.validerCondition(this.formulaire.value.condition);
      if (this.erreur === undefined) {
        this.modifie.emit(this.formulaire.value.condition);
      }
    }
  }
}
