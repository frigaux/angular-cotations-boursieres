import {Component, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {TranslatePipe} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {pasDeNomEnDoublonValidator} from '../pas-de-nom-en-doublon.validator';
import {InputText} from 'primeng/inputtext';
import {AutoFocus} from 'primeng/autofocus';

@Component({
  selector: 'app-formulaire-creation',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    Button,
    TranslatePipe,
    InputText,
    AutoFocus
  ],
  templateUrl: './formulaire-creation.component.html',
  styleUrl: './formulaire-creation.component.sass'
})
export class FormulaireCreationComponent implements OnInit {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  portefeuilles: InputSignal<Array<Portefeuille> | undefined> = input();
  cree = output<string>();

  // formulaires
  formulaire = this.formBuilder.group({
    nom: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const portefeuilles = this.portefeuilles();
    if (portefeuilles) {
      this.formulaire.get('nom')?.addValidators(pasDeNomEnDoublonValidator(portefeuilles));
    }
  }

  creerPortefeuille() {
    // au second submit du même nom, il faut s'assurer que l'on ne crée pas un doublon
    this.formulaire.get('nom')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.nom) {
      this.cree.emit(this.formulaire.value.nom);
    }
  }
}
