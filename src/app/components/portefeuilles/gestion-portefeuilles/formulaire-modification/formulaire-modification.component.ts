import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {pasDeNomEnDoublonValidator} from '../pas-de-nom-en-doublon.validator';
import {AutoFocus} from 'primeng/autofocus';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-formulaire-modification',
  imports: [
    Button,
    FloatLabel,
    InputText,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
    AutoFocus,
    Dialog
  ],
  templateUrl: './formulaire-modification.component.html',
  styleUrls: ['./formulaire-modification.component.sass', '../formulaire-creation/formulaire-creation.component.sass']
})
export class FormulaireModificationComponent {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  portefeuilles: InputSignal<Array<Portefeuille> | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuilles(o)});
  portefeuille: InputSignal<Portefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<string>();
  abandon = output<void>();

  // formulaires
  formulaireModificationPortefeuille = this.formBuilder.group({
    champNom: ['', [Validators.required]]
  });

  //données pour la vue
  portefeuilleEnModification: Portefeuille | undefined;
  titre: string | undefined;

  constructor(private translateService: TranslateService) {
  }

  intercepteurPortefeuilles(portefeuilles: Portefeuille[] | undefined) {
    if (portefeuilles) {
      this.formulaireModificationPortefeuille.get('champNom')?.addValidators(pasDeNomEnDoublonValidator(portefeuilles));
    }
    return portefeuilles;
  }

  intercepteurPortefeuille(portefeuille: Portefeuille | undefined) {
    this.portefeuilleEnModification = portefeuille;
    if (this.portefeuilleEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.FORMULAIRE_MODIFICATION.MODIFICATION_NOM', {'nom': this.portefeuilleEnModification.nom});
      this.formulaireModificationPortefeuille.get('champNom')?.setValue(this.portefeuilleEnModification.nom);
    }
    return portefeuille;
  }

  modifierNomPortefeuille() {
    this.formulaireModificationPortefeuille.get('champNom')?.updateValueAndValidity();
    if (this.formulaireModificationPortefeuille.valid && this.formulaireModificationPortefeuille.value.champNom) {
      this.modifie.emit(this.formulaireModificationPortefeuille.value.champNom);
    }
  }
}
