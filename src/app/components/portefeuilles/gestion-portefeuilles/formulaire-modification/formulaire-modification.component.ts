import {Component, inject, input, InputSignal, output} from '@angular/core';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../../services/portefeuilles/dto-portefeuille.interface';
import {pasDeNomEnDoublonValidator} from '../pas-de-nom-en-doublon.validator';
import {AutoFocus} from 'primeng/autofocus';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-formulaire-modification',
  imports: [
    Button,
    FloatLabel,
    InputText,
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
  portefeuilles: InputSignal<Array<DTOPortefeuille> | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuilles(o)});
  portefeuille: InputSignal<DTOPortefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuille(o)});
  modifie = output<string>();
  abandon = output<void>();

  // formulaires
  formulaire = this.formBuilder.group({
    nom: ['', [Validators.required]]
  });

  //données pour la vue
  portefeuilleEnModification: DTOPortefeuille | undefined;
  titre: string | undefined;

  constructor(private translateService: TranslateService) {
  }

  intercepteurPortefeuilles(portefeuilles: DTOPortefeuille[] | undefined) {
    if (portefeuilles) {
      this.formulaire.get('nom')?.addValidators(pasDeNomEnDoublonValidator(portefeuilles));
    }
    return portefeuilles;
  }

  intercepteurPortefeuille(portefeuille: DTOPortefeuille | undefined) {
    this.portefeuilleEnModification = portefeuille;
    if (this.portefeuilleEnModification) {
      this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.GESTION_PORTEFEUILLES.FORMULAIRE_MODIFICATION.MODIFICATION_NOM', {'nom': this.portefeuilleEnModification.nom});
      this.formulaire.get('nom')?.setValue(this.portefeuilleEnModification.nom);
    }
    return portefeuille;
  }

  modifierNomPortefeuille() {
    this.formulaire.get('nom')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.nom) {
      this.modifie.emit(this.formulaire.value.nom);
    }
  }
}
