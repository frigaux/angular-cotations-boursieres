import {Component, effect, inject, input, InputSignal} from '@angular/core';
import {Panel} from 'primeng/panel';
import {Cours} from '../Cours';
import {UIChart} from 'primeng/chart';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-moyennes-mobiles',
  imports: [
    Panel,
    UIChart
  ],
  templateUrl: './moyennes-mobiles.component.html',
  styleUrl: './moyennes-mobiles.component.sass',
  providers: [CurrencyPipe]
})
export class MoyennesMobilesComponent {
  value: InputSignal<Cours | undefined> = input();

  // https://www.chartjs.org/
  donnees: any;
  options: any;

  constructor() {
    const currencyPipe = inject(CurrencyPipe);
    effect(() => {
      this.initChart(currencyPipe);
    });
  }

  initChart(currencyPipe: CurrencyPipe) {
    const cours: Cours | undefined = this.value();
    if (cours) {
      const labels: string[] = [];
      const data: number[] = [];
      for (let i = cours.moyennesMobiles.length - 1; i >= 0; i--) {
        labels.push(`${i + 1}`);
        data.push(cours.moyennesMobiles[i]);
      }

      this.donnees = {
        labels,
        datasets: [
          {
            label: cours.libelle,
            data,
            tension: 0.4
          }
        ]
      };

      this.options = {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Moyennes mobiles'
            }
          },
          y: {
            ticks: {
              callback: function (value: number) {
                // TODO : showHeader is deprecated ; currencyPipe position du euro ; traduction du texte
                return currencyPipe.transform(value, 'EUR', 'symbol-narrow');
              }
            }
          }
        }
      };
    }
  }
}
