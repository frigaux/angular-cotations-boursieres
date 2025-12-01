import {Component, input, InputSignal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIChart} from 'primeng/chart';
import {Cours} from '../cours.class';

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
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  // https://www.chartjs.org/
  data: any;
  options: any;

  cours?: Cours;

  constructor(private translateService: TranslateService) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      this.initChart(cours);
    }
    return cours;
  }

  initChart(cours: Cours) {
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
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('COMPOSANTS.COURS.CHART_MOYENNES_MOBILES.NB_JOURS_CALCUL')
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
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      ]
    };
  }
}
