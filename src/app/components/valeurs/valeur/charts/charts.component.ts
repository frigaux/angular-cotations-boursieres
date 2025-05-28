import {Component, effect, input, InputSignal} from '@angular/core';
import {Cours} from '../../../cours/cours.class';
import {DTOCoursTickerLight} from '../../../../services/cours/dto-cours-ticker-light.interface';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';

// TODO : courbes des MMxx glissantes
// TODO : portefeuille
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
  cours: InputSignal<Cours | undefined> = input();
  coursLight: InputSignal<DTOCoursTickerLight[] | undefined> = input();

  // données pour la vue
  // https://www.chartjs.org/
  data: any;
  options: any;
  periodes: number[] = [];
  periodeSelectionnee: number = 50;

  constructor(private translateService: TranslateService, public datepipe: DatePipe) {
    effect(() => {
      this.initChart();
    });
  }

  clickPeriode(): void {
    this.displayChart();
  }

  initChart() {
    const listeCours: DTOCoursTickerLight[] | undefined = this.coursLight();
    if (listeCours) {
      this.periodes = [];
      for (const periode of [50, 100, 150, 200, 250, 300]) {
        this.periodes.push(periode);
        this.periodeSelectionnee = periode;
        if (listeCours.length <= periode) {
          break;
        }
      }
      this.displayChart();
    }
  }

  displayChart() {
    const cours: Cours | undefined = this.cours();
    const listeCours: DTOCoursTickerLight[] | undefined = this.coursLight();
    if (cours && listeCours && listeCours.length <= cours.moyennesMobiles.length) {
      const labels: string[] = [];
      const dataCours: number[] = [];
      const dataMM: number[] = [];
      const surplus = cours.moyennesMobiles.length - listeCours.length;
      for (let i = Math.min(listeCours.length, this.periodeSelectionnee) - 1; i >= 0; i--) {
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
