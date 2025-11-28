import {Component, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {AutoFocus} from 'primeng/autofocus';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {ParametrageService} from '../../../../services/parametrage/parametrage.service';

@Component({
  selector: 'app-formulaire-url-sauvegarde-restauration',
  imports: [
    FloatLabel,
    AutoFocus,
    TranslatePipe,
    Button,
    ReactiveFormsModule,
    InputText
  ],
  templateUrl: './formulaire-url-sauvegarde-restauration.component.html',
  styleUrls: ['./formulaire-url-sauvegarde-restauration.component.sass', '../../gestion-portefeuilles/dialog-formulaire-modification/dialog-formulaire-modification.component.sass']
})
export class FormulaireUrlSauvegardeRestaurationComponent implements OnInit {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  inputVisible: InputSignal<boolean | undefined> = input(false,
    {transform: o => this.intercepteurVisible(o), alias: 'visible'});
  modifie = output<void>();
  abandon = output<void>();

  // formulaires
  formulaire = this.formBuilder.group({
    urlSauvegardeRestauration: ['', [Validators.required, Validators.pattern('^https?://.*$')]]
  });

  // données pour la vue
  creationUrlSauvegardeRestauration: boolean = false;
  modificationUrlSauvegardeRestauration: boolean = false;
  autofocus: boolean = false;

  constructor(private parametrageService: ParametrageService) {
  }

  private intercepteurVisible(visible: boolean | undefined) {
    if (!visible) {
      this.modificationUrlSauvegardeRestauration = false;
      this.creationUrlSauvegardeRestauration = false;
    } else {
      if (this.parametrageService.chargerUrlSauvegardeRestauration() == undefined) {
        this.creationUrlSauvegardeRestauration = true;
      } else {
        this.autofocus = true;
        this.modificationUrlSauvegardeRestauration = true;
      }
    }
    return visible;
  }

  ngOnInit(): void {
    this.formulaire.get('urlSauvegardeRestauration')?.setValue(this.parametrageService.chargerUrlSauvegardeRestauration() || '');
  }

  abandonnerModification() {
    this.abandon.emit();
  }

  enregistrerUrlSauvegardeRestauration() {
    this.formulaire.get('urlSauvegardeRestauration')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.urlSauvegardeRestauration) {
      this.parametrageService.enregistrerUrlSauvegardeRestauration(this.formulaire.value.urlSauvegardeRestauration);
      this.creationUrlSauvegardeRestauration = false;
      this.modifie.emit();
    }
  }
}
