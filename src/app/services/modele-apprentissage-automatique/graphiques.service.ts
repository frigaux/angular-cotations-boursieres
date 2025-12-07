import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Logs} from '@tensorflow/tfjs';
import {Tensor} from '@tensorflow/tfjs-core';

@Injectable({
  providedIn: 'root',
})
export class GraphiquesService {
  constructor(private translateService: TranslateService) {
  }

  entrainementChartOptions() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('SERVICES.ML.GRAPHIQUES.EPOCH')
          }
        }
      }
    };
  }

  entrainementChart(logs: Array<Logs>) {
    const resultat = {
      labels: logs.map((value, index) => String(index)),
      datasets: []
    };
    if (logs && logs.length > 0) {
      this.ajouterDataset(resultat.datasets, logs, 'loss', 'LOSS');
      this.ajouterDataset(resultat.datasets, logs, 'val_loss', 'VAL_LOSS');
      this.ajouterDataset(resultat.datasets, logs, 'acc', 'ACC');
      this.ajouterDataset(resultat.datasets, logs, 'val_acc', 'VAL_ACC');
      this.ajouterDataset(resultat.datasets, logs, 'mse', 'MSE');
    }
    return resultat;
  }

  private ajouterDataset(datasets: any, logs: Array<Logs>, cle: string, cleTraduction: string) {
    if (logs[0].hasOwnProperty(cle)) {
      datasets.push({
        label: this.translateService.instant(`SERVICES.ML.GRAPHIQUES.${cleTraduction}`),
        data: logs.map(v => v[cle] as number),
        tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
      });
    }
  }

  donneesChartOptions() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('SERVICES.ML.GRAPHIQUES.ENTREE')
          }
        },
        y: {
          title: {
            display: true,
            text: this.translateService.instant('SERVICES.ML.GRAPHIQUES.SORTIE')
          }
        }

      }
    };
  }

  donneesChart(donnees: { entrees: Tensor; sorties: Tensor }, cleTraduction: string) {
    const tx = donnees.entrees.dataSync();
    const ty = donnees.sorties.dataSync();
    const data: Array<{ x: number, y: number }> = [];
    tx.forEach((x, i) => data.push({x, y: ty[i]}));
    return {
      datasets: [
        {
          label: this.translateService.instant(`SERVICES.ML.GRAPHIQUES.${cleTraduction}`),
          data,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      ]
    };
  }
}
