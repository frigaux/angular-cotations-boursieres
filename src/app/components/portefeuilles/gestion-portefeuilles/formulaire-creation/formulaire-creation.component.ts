import {Component, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../../services/portefeuilles/dto-portefeuille.interface';
import {pasDeNomEnDoublonValidator} from '../pas-de-nom-en-doublon.validator';
import {InputText} from 'primeng/inputtext';
import {AutoFocus} from 'primeng/autofocus';
import {Checkbox} from 'primeng/checkbox';

@Component({
  selector: 'app-formulaire-creation',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    Button,
    TranslatePipe,
    InputText,
    AutoFocus,
    Checkbox
  ],
  templateUrl: './formulaire-creation.component.html',
  styleUrl: './formulaire-creation.component.sass'
})
export class FormulaireCreationComponent {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  portefeuilles: InputSignal<Array<DTOPortefeuille> | undefined> = input(undefined,
    {transform: o => this.intercepteurPortefeuilles(o)});
  cree = output<{ nom: string, initialiserAlertes: boolean }>();

  // formulaires
  formulaire = this.formBuilder.group({
    nom: ['', [Validators.required]],
    initialiserAlertes: [true, [Validators.required]],
  });

  intercepteurPortefeuilles(portefeuilles: DTOPortefeuille[] | undefined) {
    if (portefeuilles) {
      this.formulaire.get('nom')?.addValidators(pasDeNomEnDoublonValidator(portefeuilles));
    }
    return portefeuilles;
  }

  creerPortefeuille() {
    // au second submit du même nom, il faut s'assurer que l'on ne crée pas un doublon
    this.formulaire.get('nom')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.nom && typeof this.formulaire.value.initialiserAlertes === "boolean") {
      this.cree.emit({
        nom: this.formulaire.value.nom,
        initialiserAlertes: this.formulaire.value.initialiserAlertes
      });
    }
  }
}
