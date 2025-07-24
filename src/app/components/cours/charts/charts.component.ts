import {Component, input, InputSignal} from '@angular/core';
import {Cours} from '../cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe, PercentPipe} from '@angular/common';
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
  providers: [DatePipe, PercentPipe],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.sass'
})
export class ChartsComponent {
  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  cours: Cours | undefined;

  // données pour la vue
  // https://www.chartjs.org/
  data: any;
  options: any;
  periodes: number[] = [];
  periodeSelectionnee: number = 50;

  constructor(private translateService: TranslateService, private datepipe: DatePipe, private percentPipe: PercentPipe) {
  }

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    this.initChart();
    return cours;
  }

  clickPeriode(): void {
    this.displayChart();
  }

  initChart() {
    if (this.cours) {
      this.periodes = [];
      for (const periode of [50, 100, 150, 200, 250, 300]) {
        this.periodes.push(periode);
        if (this.cours.coursAlleges.length <= periode) {
          this.periodeSelectionnee = periode;
          break;
        }
      }
      this.displayChart();
    }
  }

  displayChart() {
    // const listeCours: DTOCoursTickerAllege[] | undefined = this.coursLight();
    if (this.cours && this.cours.coursAlleges.length <= this.cours.moyennesMobiles.length) {
      const labels: string[] = [];
      const dataCours: number[] = [];
      const dataMM: number[] = [];
      const coursAlleges = this.cours.coursAlleges;
      const surplus = this.cours.moyennesMobiles.length - coursAlleges.length;
      for (let i = Math.min(coursAlleges.length, this.periodeSelectionnee) - 1; i >= 0; i--) {
        labels.push(this.datepipe.transform(coursAlleges[i].date, 'dd/MM/yyyy')!);
        dataCours.push(coursAlleges[i].cloture);
        dataMM.push(this.cours.moyennesMobiles[i + surplus]);
      }

      this.data = this.wrapData(labels, dataCours, dataMM);

      this.options = this.wrapOptions();
    }
  }

  private wrapOptions() {
    const formatPercent: Function = (value: number) => this.percentPipe.transform(value, '1.2-2');
    const numberFormat = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});
    const formatCurrency: Function = (value: number) => numberFormat.format(value);
    const cloture: number = this.cours!.cloture;
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
              return `${formatCurrency(context.parsed.y)} (${formatPercent((cloture / context.raw) - 1)})`;
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
