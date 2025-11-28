import {Component, inject, input, InputSignal, OnInit, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {AutoFocus} from 'primeng/autofocus';
import {TranslatePipe} from '@ngx-translate/core';
import {Button} from 'primeng/button';
import {IAService} from '../../../../services/IA/ia.service';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-formulaire-cle-api-gemini',
  imports: [
    FloatLabel,
    AutoFocus,
    TranslatePipe,
    Button,
    ReactiveFormsModule,
    InputText
  ],
  templateUrl: './formulaire-cle-api-gemini.component.html',
  styleUrls: ['./formulaire-cle-api-gemini.component.sass', '../../../parametrage/gestion-portefeuilles/dialog-formulaire-modification/dialog-formulaire-modification.component.sass']
})
export class FormulaireCleApiGeminiComponent implements OnInit {
  // injections
  private formBuilder = inject(FormBuilder);

  // input/output
  inputVisible: InputSignal<boolean | undefined> = input(false,
    {transform: o => this.intercepteurVisible(o), alias: 'visible'});
  modifie = output<void>();
  abandon = output<void>();

  // formulaires
  formulaire = this.formBuilder.group({
    cleApiGemini: ['', [Validators.required]]
  });

  // données pour la vue
  creationCleApiGemini: boolean = false;
  modificationCleApiGemini: boolean = false;
  autofocus: boolean = false;

  constructor(private iaService: IAService) {
  }

  private intercepteurVisible(visible: boolean | undefined) {
    if (!visible) {
      this.modificationCleApiGemini = false;
      this.creationCleApiGemini = false;
    } else {
      if (this.iaService.chargerCleAPIGemini() == undefined) {
        this.creationCleApiGemini = true;
      } else {
        this.autofocus = true;
        this.modificationCleApiGemini = true;
      }
    }
    return visible;
  }

  ngOnInit(): void {
    this.formulaire.get('cleApiGemini')?.setValue(this.iaService.chargerCleAPIGemini() || '');
  }

  abandonnerModification() {
    this.abandon.emit();
  }

  enregistrerCleApiGemini() {
    this.formulaire.get('cleApiGemini')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.cleApiGemini) {
      this.iaService.enregistrerCleAPIGemini(this.formulaire.value.cleApiGemini);
      this.creationCleApiGemini = false;
      this.modifie.emit();
    }
  }
}
