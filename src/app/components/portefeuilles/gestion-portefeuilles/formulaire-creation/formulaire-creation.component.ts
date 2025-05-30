import {Component, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {TranslatePipe} from '@ngx-translate/core';
import {Portefeuille} from '../portefeuille.interface';
import {pasDeNomEnDoublonValidator} from '../pas-de-nom-en-doublon.validator';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-formulaire-creation',
  imports: [
    ReactiveFormsModule,
    FloatLabel,
    Button,
    TranslatePipe,
    InputText
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
  formulaireCreationPortefeuille = this.formBuilder.group({
    champNom: ['', [Validators.required]]
  });

  ngOnInit(): void {
    const portefeuilles = this.portefeuilles();
    if (portefeuilles) {
      this.formulaireCreationPortefeuille.get('champNom')?.addValidators(pasDeNomEnDoublonValidator(portefeuilles));
    }
  }

  creerPortefeuille() {
    // au second submit du même nom, il faut s'assurer que l'on ne crée pas un doublon
    this.formulaireCreationPortefeuille.get('champNom')?.updateValueAndValidity();
    if (this.formulaireCreationPortefeuille.valid && this.formulaireCreationPortefeuille.value.champNom) {
      this.cree.emit(this.formulaireCreationPortefeuille.value.champNom);
    }
  }
}
