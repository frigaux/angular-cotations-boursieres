import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {AutoFocus} from 'primeng/autofocus';
import {DTOAlerte} from '../../../../../services/portefeuilles/dto-alerte.interface';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-editeur-condition-alerte',
  imports: [
    Dialog,
    Button,
    FloatLabel,
    FormsModule,
    InputText,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    AutoFocus,
    Card
  ],
  templateUrl: './editeur-condition-alerte.component.html',
  styleUrl: './editeur-condition-alerte.component.sass'
})
export class EditeurConditionAlerteComponent {
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

  constructor(private translateService: TranslateService) {
  }

  intercepteurAlerte(alerte: DTOAlerte | undefined) {
    this.alerteEnModification = alerte;
    if (this.alerteEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.EDITEUR_ALERTES.EDITEUR_CONDITION_ALERTE.MODIFICATION_CONDITION', {'nom': this.alerteEnModification.nom});
      this.formulaire.get('condition')?.setValue(this.alerteEnModification.condition);
    }
    return alerte;
  }

  modifierConditionAlerte() {
    this.formulaire.get('condition')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.condition && this.validerCondition()) {
      this.modifie.emit(this.formulaire.value.condition);
    }
  }

  private validerCondition() {
    const condition = this.formulaire.value.condition!
      .replaceAll(/C(\d+)/g, (match, token) => {
        return `C[${token-1}]`;
      })
      .replaceAll(/M(\d+)/g, (match, token) => {
        return `M[${token-1}]`;
      });
    try {
      new Function(
        'const C = Array.from({ length: 300 }, (v, i) => i);'
        + 'const M = Array.from({ length: 300 }, (v, i) => i);'
        + 'return ' + condition + ';'
      );
    } catch (e: unknown) {
      this.erreur = (e as SyntaxError).message;
      return false;
    }
    this.erreur = undefined;
    return true;
  }
}
