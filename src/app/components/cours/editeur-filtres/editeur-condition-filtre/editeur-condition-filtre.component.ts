import {Component, inject, input, InputSignal, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOFiltre} from '../../../../services/cours/dto-filtre.interface';
import {Dialog} from 'primeng/dialog';
import {Card} from 'primeng/card';
import {FloatLabel} from 'primeng/floatlabel';
import {AutoFocus} from 'primeng/autofocus';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-editeur-condition-filtre',
  imports: [
    Dialog,
    TranslatePipe,
    Card,
    ReactiveFormsModule,
    FloatLabel,
    AutoFocus,
    Button,
    NgIf,
    InputText
  ],
  templateUrl: './editeur-condition-filtre.component.html',
  styleUrls: ['../../../portefeuilles/gestion-portefeuilles/editeur-alertes/editeur-condition-alerte/editeur-condition-alerte.component.sass', './editeur-condition-filtre.component.sass']
})
export class EditeurConditionFiltreComponent {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  inputFiltre: InputSignal<DTOFiltre | undefined> = input(undefined,
    {transform: o => this.intercepteurAlerte(o), alias: 'filtre'});
  modifie = output<string>();
  abandon = output<void>();

  // formulaires
  formulaire = this.formBuilder.group({
    condition: ['', [Validators.required]]
  });

  //données pour la vue
  filtre: DTOFiltre | undefined;
  titre: string | undefined;
  erreur: string | undefined;

  constructor(private translateService: TranslateService) {
  }

  intercepteurAlerte(filtre: DTOFiltre | undefined) {
    this.filtre = filtre;
    if (this.filtre) {
      this.titre = this.translateService.instant('COMPOSANTS.COURS.EDITEUR_FILTRES.EDITEUR_CONDITION_FILTRE.MODIFICATION_CONDITION', {'nom': this.filtre.nom});
      this.formulaire.get('condition')?.setValue(this.filtre.condition);
    }
    return filtre;
  }

  modifierConditionFiltre() {
    this.formulaire.get('condition')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.condition && this.validerCondition()) {
      this.modifie.emit(this.formulaire.value.condition);
    }
  }

  private validerCondition() {
    const condition = this.formulaire.value.condition!
      .replaceAll(/M(\d+)/g, (match, token) => {
        return `M[${token - 1}]`;
      });
    try {
      new Function(
        'const M = Array.from({ length: 300 }, (v, i) => i);'
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
