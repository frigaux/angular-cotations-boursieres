import {Component, input, InputSignal, OnInit} from '@angular/core';
import {Cours} from '../cours.class';
import {LoaderComponent} from '../../loader/loader.component';
import {IAService} from '../../../services/IA/ia.service';
import {ReactiveFormsModule} from '@angular/forms';
import {DTOConseilsGeminiTicker} from '../../../services/IA/dto-conseils-gemini-ticker.class';
import {FormulaireCleApiGemini} from './formulaire-cle-api-gemini/formulaire-cle-api-gemini';
import {ResultatApiGemini} from './resultat-api-gemini/resultat-api-gemini';

@Component({
  selector: 'app-conseils-gemini-ticker',
  imports: [
    LoaderComponent,
    ReactiveFormsModule,
    FormulaireCleApiGemini,
    ResultatApiGemini
  ],
  templateUrl: './conseils-gemini-ticker.html',
  styleUrl: './conseils-genkit-ticker.sass'
})
export class ConseilsGeminiTicker implements OnInit {
  // chargement des informations pour le ticker
  loading: boolean = false;

  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  // données pour la vue
  cours?: Cours;
  afficherFormulaireCleApiGemini: boolean = false;
  conseilsGeminiTicker?: DTOConseilsGeminiTicker;
  erreurAPIGemini?: string;

  constructor(private iaService: IAService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    this.erreurAPIGemini = undefined;
    this.conseilsGeminiTicker = undefined;
    return cours;
  }

  ngOnInit(): void {
    if (this.iaService.chargerCleAPIGemini() == undefined) {
      this.afficherFormulaireCleApiGemini = true;
    }
  }

  interrogerApiGemini() {
    if (this.cours) {
      this.loading = true;
      this.erreurAPIGemini = undefined;
      this.conseilsGeminiTicker = undefined;
      this.iaService.interrogerApiGemini(this.cours)
        .subscribe({
          error: erreur => {
            this.erreurAPIGemini = erreur;
            this.loading = false;
          },
          next: conseils => {
            this.conseilsGeminiTicker = conseils;
            this.loading = false;
          }
        });
    }
  }
}
