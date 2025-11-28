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
  selector: 'app-dialog-formulaire-modification',
  imports: [
    Button,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    TranslatePipe,
    AutoFocus,
    Dialog
  ],
  templateUrl: './dialog-formulaire-modification.component.html',
  styleUrls: ['./dialog-formulaire-modification.component.sass']
})
export class DialogFormulaireModificationComponent {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  inputDonnees: InputSignal<{
    portefeuilles: Array<DTOPortefeuille>,
    portefeuilleNomEnModification: DTOPortefeuille | undefined
  }> = input({portefeuilles: [], portefeuilleNomEnModification: undefined},
    {transform: o => this.intercepteurDonnees(o), alias: 'donnees'});
  modifie = output<string>();
  abandon = output<void>();

  // formulaires
  formulaire = this.formBuilder.group({
    nom: ['', [Validators.required]]
  });

  //données pour la vue
  portefeuilleEnModification: DTOPortefeuille | undefined;

  constructor(private translateService: TranslateService) {
  }

  intercepteurDonnees(donnees: {
    portefeuilles: Array<DTOPortefeuille>,
    portefeuilleNomEnModification: DTOPortefeuille | undefined
  }) {
    this.portefeuilleEnModification = donnees.portefeuilleNomEnModification;
    if (this.portefeuilleEnModification) {
      const autresPortefeuilles = donnees.portefeuilles
        .filter(p => p.nom !== this.portefeuilleEnModification!.nom);
      this.formulaire.get('nom')?.addValidators(pasDeNomEnDoublonValidator(autresPortefeuilles));
      this.formulaire.get('nom')?.setValue(this.portefeuilleEnModification.nom);
    }
    return donnees;
  }

  modifierNomPortefeuille() {
    this.formulaire.get('nom')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.nom) {
      this.modifie.emit(this.formulaire.value.nom);
    }
  }
}
