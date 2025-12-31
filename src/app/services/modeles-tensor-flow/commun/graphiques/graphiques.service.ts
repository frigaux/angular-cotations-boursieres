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
            text: this.translateService.instant('SERVICES.ML.GRAPHIQUES.ITERATION')
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
      // les clés de l'objet log correspondent aux paramètres loss et metrics du modèle
      Object.keys(logs[0]).forEach(cle => {
        this.ajouterDataset(resultat.datasets, logs, cle);
      });
    }
    return resultat;
  }

  private ajouterDataset(datasets: Array<any>, logs: Array<Logs>, cle: string) {
    datasets.push({
      label: cle,
      data: logs.map(v => v[cle] as number),
      tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
    });
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
