import {Component, input, InputSignal, output} from '@angular/core';
import {Panel} from 'primeng/panel';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe, NgClass} from '@angular/common';
import {CotationsDecorees} from '../cotations-decorees.class';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {InformationsValeurComponent} from '../../cours/informations-valeur/informations-valeur.component';
import {Cours} from '../../cours/cours.class';
import {UIChart} from 'primeng/chart';
import {DTOCotations} from '../../../services/bourse-direct/dto-cotations.interface';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    ChartsComponent,
    TranslatePipe,
    InformationsValeurComponent,
    NgClass,
    UIChart
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCotations: InputSignal<CotationsDecorees | undefined> = input(undefined,
    {transform: o => this.intercepteurCotationsDecorees(o), alias: 'cotations'});
  ferme = output<void>();

  // données pour la vue
  cotationsDecorees: CotationsDecorees | undefined;
  cours: Cours | undefined;
  informationsDetaillees: boolean = false;
  coursDataChartLine: any;
  coursOptionsChartLine: any; // https://www.chartjs.org/

  private numberFormatToCurrency = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});

  constructor(private translateService: TranslateService,
              private datepipe: DatePipe) {
  }

  private intercepteurCotationsDecorees(cotationsDecorees: CotationsDecorees | undefined) {
    this.informationsDetaillees = false;
    this.cotationsDecorees = cotationsDecorees;
    this.cours = cotationsDecorees && cotationsDecorees.cours ? Cours.fromValeurEtCours(cotationsDecorees.valeur, cotationsDecorees.cours) : undefined;
    this.coursDataChartLine = cotationsDecorees ? this.wrapCoursDataChartLine(cotationsDecorees.cotations[cotationsDecorees.cotations.length - 1]) : undefined;
    this.coursOptionsChartLine = this.wrapCoursOptionsChartLine();
    return cotationsDecorees;
  }

  private wrapCoursDataChartLine(cotations: DTOCotations) {
    const labels: Array<string> = [];
    const data: Array<number> = [];

    cotations.jour?.forEach(cours => {
      labels.push(this.datepipe.transform(cours.date, 'HH:mm')!);
      data.push(cours.cours);
    });
    return {
      labels,
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.BOURSICOTAGE.DETAILS_VALEUR.COURS'),
          data,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      ]
    };
  }

  private wrapCoursOptionsChartLine() {
    const formatCurrency: Function = (value: number) => this.numberFormatToCurrency.format(value);
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
              return formatCurrency(value);
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
              return formatCurrency(context.parsed.y);
            }
          }
        }
      }
    };
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cotationsDecorees?.valeur.ticker}/`);
  }

  abcBourse() {
    window.open(AbcBourseService.urlCotation(this.cotationsDecorees?.valeur.ticker));
  }
}
