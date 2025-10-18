import {Component, input, InputSignal} from '@angular/core';
import {DTOInformationsTicker} from '../../../services/abc-bourse/dto-informations-ticker.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {Fieldset} from 'primeng/fieldset';
import {LoaderComponent} from '../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, PercentPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Cours} from '../cours.class';
import {DTOActualiteTicker} from '../../../services/abc-bourse/dto-actualite-ticker.class';
import {ActualiteTickerComponent} from './actualite-ticker/actualite-ticker.component';
import {ConseilsGeminiTickerComponent} from '../conseils-gemini-ticker/conseils-gemini-ticker.component';

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
    ActualiteTickerComponent,
    DatePipe,
    ConseilsGeminiTickerComponent
  ],
  templateUrl: './informations-ticker.component.html',
  styleUrl: './informations-ticker.component.sass'
})
export class InformationsTickerComponent {
  // chargement des informations pour le ticker
  loading: boolean = true;

  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  cours?: Cours;

  // données pour la vue
  informationsTicker?: DTOInformationsTicker;
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
        error: httpResponseError => {
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
