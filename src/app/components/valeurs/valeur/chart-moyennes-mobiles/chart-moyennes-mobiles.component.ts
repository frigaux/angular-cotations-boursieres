import {Component, effect, input, InputSignal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIChart} from 'primeng/chart';
import {Cours} from '../../../cours/cours.class';

@Component({
  selector: 'app-chart-moyennes-mobiles',
  imports: [
    UIChart
  ],
  templateUrl: './chart-moyennes-mobiles.component.html',
  styleUrl: './chart-moyennes-mobiles.component.sass'
})
export class ChartMoyennesMobilesComponent {
  // input/output
  cours: InputSignal<Cours | undefined> = input();

  // https://www.chartjs.org/
  data: any;
  options: any;

  constructor(private translateService: TranslateService) {
    effect(() => {
      this.initChart();
    });
  }

  initChart() {
    const cours: Cours | undefined = this.cours();
    if (cours) {
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = cours.moyennesMobiles.length - 1; i >= 0; i--) {
        labels.push(`${i + 1}`);
        data.push(cours.moyennesMobiles[i]);
      }

      this.data = this.wrapData(labels, cours, data);

      this.options = this.wrapOptions();
    }
  }

  private wrapOptions() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHART_MOYENNES_MOBILES.NB_JOURS_CALCUL')
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
              return `MM${context[0].label}`;
            },
            label: function (context: any) {
              return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(context.parsed.y);
            }
          }
        }
      }
    };
  }

  private wrapData(labels: string[], cours: Cours, data: number[]) {
    return {
      labels,
      datasets: [
        {
          label: cours.libelle,
          data,
          tension: 0.4
        }
      ]
    };
  }
}
