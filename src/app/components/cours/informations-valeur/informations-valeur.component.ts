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
import {FieldsetIndicateursComponent} from './fieldset-indicateurs/fieldset-indicateurs.component';
import {forkJoin} from 'rxjs';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {
  CotationsValeurBoursoramaDecore
} from '../../portefeuilles/popover-actions-valeur/dialog-cotations-valeur/cotations-valeur-boursorama-genere.class';
import {UIChart} from 'primeng/chart';
import {FieldsetCotationsComponent} from './fieldset-cotations/fieldset-cotations.component';
import {FieldsetActualitesComponent} from './fieldset-actualites/fieldset-actualites.component';
import {FieldsetAnalysesComponent} from './fieldset-analyses/fieldset-analyses.component';
import {FieldsetPrevisionsComponent} from './fieldset-previsions/fieldset-previsions.component';
import {DTOInformation} from '../../../services/boursorama/dto-information.interface';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {DTOActualiteTicker} from '../../../services/abc-bourse/dto-actualite-ticker.class';

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
    FieldsetIndicateursComponent,
    UIChart,
    FieldsetCotationsComponent,
    FieldsetActualitesComponent,
    FieldsetAnalysesComponent,
    FieldsetPrevisionsComponent
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
  actualites?: Array<DTOInformation>;

  constructor(private translateService: TranslateService,
              private abcBourseService: AbcBourseService,
              private boursoramaService: BoursoramaService,
              private dividendesService: DividendesService) {
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
          this.actualites = this.agregerActualites(dtoAbcBourse.actualites, dtoBoursorama.actualites);
          this.dtoAbcBourse = dtoAbcBourse;
          const dividendes = this.dividendesService.chargerParTicker(cours.ticker);
          this.dtoBoursoramaDecore = new CotationsValeurBoursoramaDecore(this.translateService, 0, dtoBoursorama, dividendes);
          this.loading = false;
        }
      });
    }
    return cours;
  }

  protected afficherActualite(information: DTOInformation) {
    const actualiteABC = this.dtoAbcBourse!.actualites
      .find(a => a.pathname === information.pathname);
    if (actualiteABC) {
      this.dialogChargerLienComponent()?.afficherActualiteABCBourse(actualiteABC);
    } else {
      this.dialogChargerLienComponent()?.afficherInformationBoursorama(information);
    }
  }

  protected afficherInformationBoursorama(information: DTOInformation) {
    this.dialogChargerLienComponent()?.afficherInformationBoursorama(information);
  }

  private agregerActualites(actualitesAbc: Array<DTOActualiteTicker>, actualitesBoursorama: Array<DTOInformation>): Array<DTOInformation> {
    const actualites: Array<DTOInformation> = [];
    actualites.push(...actualitesBoursorama);
    actualitesAbc.forEach(actualite => {
      actualites.push({id: NaN, ...actualite});
    });
    actualites.sort((a1, a2) => a2.date.localeCompare(a1.date));
    actualites.forEach((a, i) => a.id = i);
    return actualites;
  }
}
