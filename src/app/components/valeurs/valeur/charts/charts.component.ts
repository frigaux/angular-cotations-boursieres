import {Component, input, InputSignal} from '@angular/core';
import {Cours} from '../../../cours/cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-charts',
  imports: [
    UIChart,
    RadioButton,
    FormsModule,
    TranslatePipe
  ],
  providers: [DatePipe],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.sass'
})
export class ChartsComponent {
  // input/output
  cours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o)});

  // données pour la vue
  // https://www.chartjs.org/
  data: any;
  options: any;
  periodes: number[] = [];
  periodeSelectionnee: number = 50;

  constructor(private translateService: TranslateService, public datepipe: DatePipe) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    if (cours) {
      this.initChart(cours);
    }
    return cours;
  }

  clickPeriode(): void {
    const cours: Cours | undefined = this.cours();
    if (cours) {
      this.displayChart(cours);
    }
  }

  initChart(cours: Cours) {
    this.periodes = [];
    for (const periode of [50, 100, 150, 200, 250, 300]) {
      this.periodes.push(periode);
      this.periodeSelectionnee = periode;
      if (cours.coursAlleges.length <= periode) {
        break;
      }
    }
    this.displayChart(cours);
  }

  displayChart(cours: Cours) {
    // const listeCours: DTOCoursTickerAllege[] | undefined = this.coursLight();
    if (cours && cours.coursAlleges.length <= cours.moyennesMobiles.length) {
      const labels: string[] = [];
      const dataCours: number[] = [];
      const dataMM: number[] = [];
      const coursAlleges = cours.coursAlleges;
      const surplus = cours.moyennesMobiles.length - coursAlleges.length;
      for (let i = Math.min(coursAlleges.length, this.periodeSelectionnee) - 1; i >= 0; i--) {
        labels.push(this.datepipe.transform(coursAlleges[i].date, 'dd/MM/yyyy')!);
        dataCours.push(coursAlleges[i].cloture);
        dataMM.push(cours.moyennesMobiles[i + surplus]);
      }

      this.data = this.wrapData(labels, dataCours, dataMM);

      this.options = this.wrapOptions();
    }
  }

  private wrapOptions() {
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
        tooltip: {
          callbacks: {
            title: function (context: any) {
              const dot = context[0];
              if (dot.datasetIndex === 0) {
                return dot.label;
              } else {
                return `MM${dot.dataset.data.length - dot.dataIndex}`;
              }
            },
            label: function (context: any) {
              return new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(context.parsed.y);
            }
          }
        }
      }
    };
  }

  private wrapData(labels: string[], dataCours: number[], dataMM: number[]) {
    return {
      labels,
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHARTS.COURS'),
          data: dataCours,
          tension: 0.4
        },
        {
          label: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHARTS.MOYENNES_MOBILES') + labels[labels.length - 1],
          data: dataMM,
          tension: 0.4
        }
      ]
    };
  }
}
