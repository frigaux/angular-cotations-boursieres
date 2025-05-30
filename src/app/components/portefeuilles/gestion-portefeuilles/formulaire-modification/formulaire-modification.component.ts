import {Component, effect, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {NgIf} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {pasDeNomEnDoublonValidator} from '../pas-de-nom-en-doublon.validator';

@Component({
  selector: 'app-formulaire-modification',
  imports: [
    Button,
    FloatLabel,
    InputText,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './formulaire-modification.component.html',
  styleUrls: ['./formulaire-modification.component.sass', '../formulaire-creation/formulaire-creation.component.sass']
})
export class FormulaireModificationComponent implements OnInit {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  portefeuilles: InputSignal<Array<Portefeuille> | undefined> = input();
  portefeuille: InputSignal<Portefeuille | undefined> = input();
  modifie = output<string>();
  annule = output();

  // formulaires
  formulaireModificationPortefeuille = this.formBuilder.group({
    champNom: ['', [Validators.required]]
  });

  //données pour la vue
  portefeuilleEnModification: Portefeuille | undefined;

  constructor() {
    effect(() => {
      this.portefeuilleEnModification = this.portefeuille();
      if (this.portefeuilleEnModification) {
        this.formulaireModificationPortefeuille.get('champNom')?.setValue(this.portefeuilleEnModification.nom);
      }
    });
  }

  ngOnInit(): void {
    const portefeuilles = this.portefeuilles();
    if (portefeuilles) {
      this.formulaireModificationPortefeuille.get('champNom')?.addValidators(pasDeNomEnDoublonValidator(portefeuilles));
    }
  }

  modifierPortefeuille() {
    this.formulaireModificationPortefeuille.get('champNom')?.updateValueAndValidity();
    if (this.formulaireModificationPortefeuille.valid && this.formulaireModificationPortefeuille.value.champNom) {
      this.modifie.emit(this.formulaireModificationPortefeuille.value.champNom);
    }
  }
}
