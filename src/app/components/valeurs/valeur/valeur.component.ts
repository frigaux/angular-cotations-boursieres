import {Component, effect, input, InputSignal, output} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {UIChart} from 'primeng/chart';
import {CoursService} from '../../../services/cours/cours.service';
import {NgIf} from '@angular/common';
import {DTOCoursTicker} from '../../../services/cours/DTOCoursTicker';
import {DTOCoursTickerLight} from '../../../services/cours/DTOCoursTickerLight';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'app-valeur',
  imports: [
    Panel,
    UIChart,
    NgIf,
    TranslatePipe,
    ProgressBar
  ],
  templateUrl: './valeur.component.html',
  styleUrl: './valeur.component.sass'
})
export class ValeurComponent {
  // input/output
  ticker: InputSignal<string | undefined> = input();
  closed = output<void>();

  // chargement des cours
  loading: boolean = true;
  limit: number = 100;

  // données pour la vue
  cours: DTOCoursTicker | undefined;
  coursLight: DTOCoursTickerLight[] | undefined;

  // https://www.chartjs.org/
  data: any;
  options: any;

  constructor(private translateService: TranslateService, private coursService: CoursService) {
    effect(() => {
      this.initChart();
    });
  }

  initChart() {
    const ticker: string | undefined = this.ticker();
    if (ticker) {
      this.loading = true;
      this.coursService.chargerCoursTicker(ticker).subscribe(cours => {
        this.cours = cours;
        this.coursService.chargerCoursTickerWithLimit(ticker, this.limit).subscribe(cours => {
          this.coursLight = cours;
          this.loading = false;
          this.initChartMoyennesMobiles(this.cours!);
        })
      });
    }
  }

  private initChartMoyennesMobiles(cours: DTOCoursTicker) {
    const labels: string[] = [];
    const data: number[] = [];
    for (let i = cours.moyennesMobiles.length - 1; i >= 0; i--) {
      labels.push(`${i + 1}`);
      data.push(cours.moyennesMobiles[i]);
    }

    this.data = this.wrapData(labels, cours, data);

    this.options = this.wrapOptions();
  }

  private wrapOptions() {
    const title: string = this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.JOURS');
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.NB_JOURS_CALCUL')
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
        tooltip: {
          callbacks: {
            title: function (context: any) {
              return context[0].label + ' ' + title;
            },
            label: function (context: any) {
              return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(context.parsed.y);
            }
          }
        }
      }
    };
  }

  private wrapData(labels: string[], cours: DTOCoursTicker, data: number[]) {
    return {
      labels,
      datasets: [
        {
          label: 'cours.libelle',
          data,
          tension: 0.4
        }
      ]
    };
  }

}
