import {Component, input, InputSignal, viewChild} from '@angular/core';
import {DTOInformationsTickerABCBourse} from '../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {Fieldset} from 'primeng/fieldset';
import {LoaderComponent} from '../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Cours} from '../cours.class';
import {DialogChargerLienComponent} from '../../commun/dialog-charger-lien/dialog-charger-lien.component';
import {ConseilsGeminiValeurComponent} from '../conseils-gemini-valeur/conseils-gemini-valeur.component';
import {FieldsetDividendesComponent} from './fieldset-dividendes/fieldset-dividendes.component';
import {FieldsetVariationsComponent} from './fieldset-variations/fieldset-variations.component';
import {FieldsetRatiosComponent} from './fieldset-ratios/fieldset-ratios.component';
import {forkJoin} from 'rxjs';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {
  DTOInformationsTickerBoursorama
} from '../../../services/boursorama/dto-informations-ticker-boursorama.interface';
import {
  CotationsValeurBoursoramaDecore
} from '../../portefeuilles/popover-actions-valeur/dialog-cotations-valeur/cotations-valeur-boursorama-genere.class';
import {UIChart} from 'primeng/chart';

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
    FieldsetRatiosComponent,
    UIChart
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
  dtoAbcBourse?: DTOInformationsTickerABCBourse;
  dtoBoursoramaDecore?: CotationsValeurBoursoramaDecore;

  constructor(private translateService: TranslateService,
              private abcBourseService: AbcBourseService,
              private boursoramaService: BoursoramaService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      this.dtoAbcBourse = undefined;
      this.dtoBoursoramaDecore = undefined;
      this.loading = true;

      forkJoin([
        this.abcBourseService.chargerInformationsTicker(cours.ticker),
        this.boursoramaService.chargerInformationsTicker({ticker: cours.ticker, libelle: cours.libelle})
      ]).subscribe({
        error: httpErrorResponse => {
          this.loading = false;
        },
        next: ([dtoAbcBourse, dtoBoursorama]) => {
          this.dtoAbcBourse = dtoAbcBourse;
          this.dtoBoursoramaDecore = new CotationsValeurBoursoramaDecore(this.translateService, 0, dtoBoursorama);
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
