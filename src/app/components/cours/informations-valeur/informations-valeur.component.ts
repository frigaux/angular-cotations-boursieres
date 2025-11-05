import {Component, input, InputSignal} from '@angular/core';
import {DTOInformationsTickerABCBourse} from '../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {Fieldset} from 'primeng/fieldset';
import {LoaderComponent} from '../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, PercentPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Cours} from '../cours.class';
import {DTOActualiteTicker} from '../../../services/abc-bourse/dto-actualite-ticker.class';
import {DialogActualiteValeurComponent} from './dialog-actualite-valeur/dialog-actualite-valeur.component';
import {ConseilsGeminiValeurComponent} from '../conseils-gemini-valeur/conseils-gemini-valeur.component';

@Component({
  selector: 'app-informations-ticker',
  imports: [
    Fieldset,
    LoaderComponent,
    TableModule,
    PercentPipe,
    TranslatePipe,
    DecimalPipe,
    CurrencyPipe,
    NgClass,
    DialogActualiteValeurComponent,
    DatePipe,
    ConseilsGeminiValeurComponent
  ],
  templateUrl: './informations-valeur.component.html',
  styleUrl: './informations-valeur.component.sass'
})
export class InformationsValeurComponent {
  // chargement des informations pour le ticker
  loading: boolean = true;

  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  cours?: Cours;

  // données pour la vue
  informationsTicker?: DTOInformationsTickerABCBourse;
  pourcentageDividendes?: number;
  actualiteCourante?: DTOActualiteTicker

  constructor(private abcBourseService: AbcBourseService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      this.informationsTicker = undefined;
      this.pourcentageDividendes = undefined;
      this.loading = true;

      this.abcBourseService.chargerInformationsTicker(cours.ticker).subscribe({
        error: httpErrorResponse => {
          this.loading = false;
        },
        next: dto => {
          this.informationsTicker = dto;
          this.pourcentageDividendes = dto.dividendes.length > 0 ? dto.dividendes[0].montant / cours.cloture : 0;
          this.loading = false;
        }
      });
    }
    return cours;
  }

  afficherActualite(actualite: DTOActualiteTicker) {
    this.actualiteCourante = actualite;
  }
}
