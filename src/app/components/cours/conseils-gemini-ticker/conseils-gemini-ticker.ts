import {Component, inject, input, InputSignal} from '@angular/core';
import {Cours} from '../cours.class';
import {LoaderComponent} from '../../loader/loader.component';
import {IAService} from '../../../services/IA/ia.service';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {AutoFocus} from 'primeng/autofocus';
import {Button} from 'primeng/button';
import {DTOConseilsGeminiTicker} from '../../../services/IA/dto-conseils-gemini-ticker.class';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-conseils-gemini-ticker',
  imports: [
    LoaderComponent,
    FloatLabel,
    InputText,
    ReactiveFormsModule,
    TranslatePipe,
    AutoFocus,
    Button,
    CurrencyPipe
  ],
  templateUrl: './conseils-gemini-ticker.html',
  styleUrls: ['./conseils-genkit-ticker.sass', '../../portefeuilles/gestion-portefeuilles/formulaire-creation/formulaire-creation.component.sass']
})
export class ConseilsGeminiTicker {
  // injections
  private formBuilder = inject(FormBuilder);

  // chargement des informations pour le ticker
  loading: boolean = false;

  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  // formulaires
  formulaire = this.formBuilder.group({
    cleApiGemini: ['', [Validators.required]]
  });

  // données pour la vue
  cours?: Cours;
  creationCleApiGemini: boolean = false;
  modificationCleApiGemini: boolean = false;
  conseilsGeminiTicker?: DTOConseilsGeminiTicker;
  erreurAPIGemini?: string;

  constructor(private iaService: IAService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      this.erreurAPIGemini = undefined;
      this.conseilsGeminiTicker = undefined;
      if (this.iaService.chargerCleAPIGemini() == undefined) {
        this.creationCleApiGemini = true;
      }
    }
    return cours;
  }

  enregistrerCleApiGemini() {
    this.formulaire.get('cleApiGemini')?.updateValueAndValidity();
    if (this.formulaire.valid && this.formulaire.value.cleApiGemini) {
      this.iaService.enregistrerCleAPIGemini(this.formulaire.value.cleApiGemini);
      this.creationCleApiGemini = false;
      this.modificationCleApiGemini = false;
    }
  }

  interrogerApiGemini() {
    if (this.cours) {
      this.loading = true;
      this.iaService.interrogerApiGemini(this.cours)
        .subscribe({
          error: erreur => {
            this.erreurAPIGemini = erreur;
            this.loading = false;
          },
          next: conseils => {
            this.erreurAPIGemini = undefined;
            this.conseilsGeminiTicker = conseils;
            this.loading = false;
          }
        });
    }
  }

  modification() {
    const cle = this.iaService.chargerCleAPIGemini();
    if (cle) {
      this.formulaire.get('cleApiGemini')?.setValue(cle);
    }
    this.modificationCleApiGemini = true;
  }

  abandonnerModification() {
    this.modificationCleApiGemini = false;
  }
}
