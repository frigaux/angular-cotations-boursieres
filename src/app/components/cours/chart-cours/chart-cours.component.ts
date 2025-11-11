import {Component, input, InputSignal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UIChart} from 'primeng/chart';
import {Cours} from '../cours.class';
import {DatePipe} from '@angular/common';

// TODO : code mort
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
  cours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o)});

  // https://www.chartjs.org/
  data: any;
  options: any;

  constructor(private translateService: TranslateService, public datepipe: DatePipe) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    if (cours) {
      this.initChart(cours);
    }
    return cours;
  }

  initChart(cours: Cours) {
    const labels: string[] = [];
    const data: number[] = [];
    const coursAlleges = cours.coursAlleges;
    for (let i = coursAlleges.length - 1; i >= 0; i--) {
      labels.push(this.datepipe.transform(coursAlleges[i].date, 'dd/MM/yyyy')!);
      data.push(coursAlleges[i].cloture);
    }

    this.data = this.wrapData(cours.libelle, labels, data);

    this.options = this.wrapOptions();
  }

  private wrapOptions() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('COMPOSANTS.COURS.CHART_COURS.CLOTURE')
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

  private wrapData(libelle: string, labels: string[], data: number[]) {
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
