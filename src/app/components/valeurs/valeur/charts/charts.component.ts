import {Component, effect, input, InputSignal} from '@angular/core';
import {Cours} from '../../../cours/Cours';
import {DTOCoursTickerLight} from '../../../../services/cours/DTOCoursTickerLight';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {UIChart} from 'primeng/chart';

// TODO : selecteur de la période affichée
// TODO : courbes des MMxx glissantes + WS
// TODO : portefeuille
@Component({
  selector: 'app-charts',
  imports: [
    UIChart
  ],
  providers: [DatePipe],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.sass'
})
export class ChartsComponent {
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
    const cours: Cours | undefined = this.cours();
    const listeCours: DTOCoursTickerLight[] | undefined = this.coursLight();
    console.log(cours, listeCours);
    if (cours && listeCours && listeCours.length <= cours.moyennesMobiles.length) {
      const labels: string[] = [];
      const dataCours: number[] = [];
      const dataMM: number[] = [];
      const surplus = cours.moyennesMobiles.length - listeCours.length;
      for (let i = listeCours.length - 1; i >= 0; i--) {
        labels.push(this.datepipe.transform(listeCours[i].date, 'dd/MM/yyyy')!);
        dataCours.push(listeCours[i].cloture);
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
              console.log(context);
              const dot= context[0];
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
    console.log(labels, dataCours, dataMM);
    return {
      labels,
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHARTS.COURS'),
          data : dataCours,
          tension: 0.4
        },
        {
          label: this.translateService.instant('COMPOSANTS.VALEURS.VALEUR.CHARTS.MOYENNES_MOBILES') + labels[labels.length - 1],
          data : dataMM,
          tension: 0.4
        }
      ]
    };
  }
}
