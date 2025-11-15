import {Component, input, InputSignal, viewChild} from '@angular/core';
import {DTOInformationsTickerABCBourse} from '../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {Fieldset} from 'primeng/fieldset';
import {LoaderComponent} from '../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {Cours} from '../cours.class';
import {DialogChargerLienComponent} from '../../commun/dialog-charger-lien/dialog-charger-lien.component';
import {ConseilsGeminiValeurComponent} from '../conseils-gemini-valeur/conseils-gemini-valeur.component';
import {FieldsetDividendesComponent} from './fieldset-dividendes/fieldset-dividendes.component';
import {FieldsetVariationsComponent} from './fieldset-variations/fieldset-variations.component';
import {FieldsetRatiosComponent} from './fieldset-ratios/fieldset-ratios.component';

@Component({
  selector: 'app-informations-ticker',
  imports: [
    Fieldset,
    LoaderComponent,
    TableModule,
    TranslatePipe,
    DialogChargerLienComponent,
    ConseilsGeminiValeurComponent,
    FieldsetDividendesComponent,
    FieldsetVariationsComponent,
    FieldsetRatiosComponent
  ],
  templateUrl: './informations-valeur.component.html',
  styleUrl: './informations-valeur.component.sass'
})
export class InformationsValeurComponent {
  private dialogChargerLienComponent = viewChild(DialogChargerLienComponent);

  // chargement des informations pour le ticker
  loading: boolean = true;

  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  cours?: Cours;

  // données pour la vue
  informationsTicker?: DTOInformationsTickerABCBourse;

  constructor(private abcBourseService: AbcBourseService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      this.informationsTicker = undefined;
      this.loading = true;

      this.abcBourseService.chargerInformationsTicker(cours.ticker).subscribe({
        error: httpErrorResponse => {
          this.loading = false;
        },
        next: dto => {
          this.informationsTicker = dto;
          this.loading = false;
        }
      });
    }
    return cours;
  }

  // afficherActualite(actualite: DTOActualiteTicker) {
  //   this.dialogChargerLienComponent()?.afficherActualiteABCBourse(actualite);
  // }
}
