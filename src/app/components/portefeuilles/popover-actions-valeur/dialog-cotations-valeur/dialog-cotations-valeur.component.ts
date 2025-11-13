import {Component, viewChild} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {UIChart} from 'primeng/chart';
import {Fieldset} from 'primeng/fieldset';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {CotationsValeurBoursoramaDecore} from './cotations-valeur-boursorama-genere.class';
import {JaugeComponent} from '../../../commun/jauge/jauge.component';
import {VueUtil} from '../../../commun/vue-util.class';
import {
  DialogActualiteValeurComponent
} from '../../../commun/dialog-actualite-valeur/dialog-actualite-valeur.component';
import {DTOInformation} from '../../../../services/boursorama/dto-information.interface';
import {DTOValeur} from '../../../../services/boursorama/dto-valeur.interface';

@Component({
  selector: 'app-dialog-cotations-valeur',
  imports: [
    Dialog,
    LoaderComponent,
    TableModule,
    TranslatePipe,
    UIChart,
    Fieldset,
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
    DatePipe,
    JaugeComponent,
    DialogActualiteValeurComponent
  ],
  templateUrl: './dialog-cotations-valeur.component.html',
  styleUrls: ['./dialog-cotations-valeur.component.sass', '../../../commun/barre-superieure.sass']
})
export class DialogCotationsValeurComponent {
  private dialogActualiteValeurComponent = viewChild(DialogActualiteValeurComponent);

  // données pour la vue
  protected visible: boolean = false;
  protected loading: boolean = false;
  protected valeur?: DTOValeur;
  protected cotationsTickerDecore?: CotationsValeurBoursoramaDecore;
  protected chartOptions: any; // https://www.chartjs.org/
  protected readonly VueUtil = VueUtil;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
    this.chartOptions = this.wrapChartOptions();
  }

  afficherCours(valeur: DTOValeur) {
    this.valeur = valeur;
    this.cotationsTickerDecore = undefined;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerInformationsTicker(valeur).subscribe({
        next:
          cotationsTickerBoursorama => {
            this.cotationsTickerDecore = new CotationsValeurBoursoramaDecore(this.translateService, 0, cotationsTickerBoursorama);
            this.loading = false;
          },
        error:
          httpErrorResponse => this.loading = false
      }
    )
  }

  afficherCotationsTickerBoursoramaDecore(cotationsTickerDecore: CotationsValeurBoursoramaDecore) {
    this.visible = true;
    this.valeur = cotationsTickerDecore.dto.valeur;
    this.cotationsTickerDecore = cotationsTickerDecore;
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.valeur) {
      this.afficherCours(this.valeur);
    }
  }

  protected afficherInformation(actualite: DTOInformation) {
    this.dialogActualiteValeurComponent()?.afficherInformationBoursorama(actualite);
  }

  private wrapChartOptions() {
    return {
      scales: {
        x: {
          title: {
            display: false
          }
        },
        y: {
          ticks: {
            callback: function (value: number) {
              return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(value);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            title: function (context: any) {
              return context[0].label;
            },
            label: function (context: any) {
              return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(context.parsed.y);
            }
          }
        }
      }
    };
  }
}
