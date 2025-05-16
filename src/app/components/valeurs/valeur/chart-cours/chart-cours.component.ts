import {Component, effect, input, InputSignal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIChart} from 'primeng/chart';
import {DTOCoursTickerLight} from '../../../../services/cours/DTOCoursTickerLight';

@Component({
  selector: 'app-chart-cours',
  imports: [
    UIChart
  ],
  templateUrl: './chart-cours.component.html',
  styleUrl: './chart-cours.component.sass'
})
export class ChartCoursComponent {
  // input/output
  coursLight: InputSignal<DTOCoursTickerLight[] | undefined> = input();

  // https://www.chartjs.org/
  data: any;
  options: any;

  constructor(private translateService: TranslateService) {
    effect(() => {
      this.initChart();
    });
  }

  initChart() {
    const cours: DTOCoursTickerLight[] | undefined = this.coursLight();
    if (cours) {
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = cours.length - 1; i >= 0; i--) {
        labels.push(cours[i].date.toString());
        data.push(cours[i].cloture);
      }

      this.data = this.wrapData(labels, 'todo', data);

      this.options = this.wrapOptions();
    }
  }

  private wrapOptions() {
    const tooltipTitle: string = this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHART_COURS.JOURS');
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHART_COURS.CLOTURE')
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
            title: function(context: any) {
              return context[0].label + ' ' + tooltipTitle;
            },
            label: function (context: any) {
              return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(context.parsed.y);
            }
          }
        }
      }
    };
  }

  private wrapData(labels: string[], libelle: string, data: number[]) {
    return {
      labels,
      datasets: [
        {
          label: libelle,
          data,
          tension: 0.4
        }
      ]
    };
  }
}
