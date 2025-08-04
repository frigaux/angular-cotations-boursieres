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
import {CoursService} from '../../../../services/cours/cours.service';

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

  constructor(private translateService: TranslateService,
              private coursService: CoursService) {
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
    if (this.formulaire.valid && this.formulaire.value.condition) {
      this.erreur = this.coursService.validerCondition(this.formulaire.value.condition);
      if (this.erreur === undefined) {
        this.modifie.emit(this.formulaire.value.condition);
      }
    }
  }

}
