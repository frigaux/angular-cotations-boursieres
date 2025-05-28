import {Component, effect, input, InputSignal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIChart} from 'primeng/chart';
import {DTOCoursTickerLight} from '../../../../services/cours/dto-cours-ticker-light.interface';
import {Cours} from '../../../cours/cours.class';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-chart-cours',
  imports: [
    UIChart
  ],
  providers: [DatePipe],
  templateUrl: './chart-cours.component.html',
  styleUrl: './chart-cours.component.sass'
})
export class ChartCoursComponent {
  // input/output
  cours: InputSignal<Cours | undefined> = input();
  coursLight: InputSignal<DTOCoursTickerLight[] | undefined> = input();

  // https://www.chartjs.org/
  data: any;
  options: any;

  constructor(private translateService: TranslateService, public datepipe: DatePipe) {
    effect(() => {
      this.initChart();
    });
  }

  initChart() {
    const listeCours: DTOCoursTickerLight[] | undefined = this.coursLight();
    if (listeCours) {
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = listeCours.length - 1; i >= 0; i--) {
        labels.push(this.datepipe.transform(listeCours[i].date, 'dd/MM/yyyy')!);
        data.push(listeCours[i].cloture);
      }

      this.data = this.wrapData(labels, data);

      this.options = this.wrapOptions();
    }
  }

  private wrapOptions() {
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

  private wrapData(labels: string[], data: number[]) {
    const cours: Cours | undefined = this.cours();
    return {
      labels,
      datasets: [
        {
          label: cours!.libelle,
          data,
          tension: 0.4
        }
      ]
    };
  }
}
