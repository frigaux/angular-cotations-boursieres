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
    return {
      labels: logs.map((value, index) => String(index)),
      datasets: [
        {
          label: this.translateService.instant('SERVICES.ML.GRAPHIQUES.LOSS'),
          data: logs.map(v => v['loss'] as number),
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        },
        {
          label: this.translateService.instant('SERVICES.ML.GRAPHIQUES.VAL_LOSS'),
          data: logs.map(v => v['val_loss'] as number),
          tension: 0.4,
          hidden: true
        },
        {
          label: this.translateService.instant('SERVICES.ML.GRAPHIQUES.ACC'),
          data: logs.map(v => v['acc'] as number),
          tension: 0.4,
          hidden: true
        },
        {
          label: this.translateService.instant('SERVICES.ML.GRAPHIQUES.VAL_ACC'),
          data: logs.map(v => v['val_acc'] as number),
          tension: 0.4,
          hidden: true
        }
      ]
    };
  }

  donneesChartOptions() {
    return {
      scales: {
        x: {
          title: {
            display: true,
            text: this.translateService.instant('SERVICES.ML.GRAPHIQUES.X')
          }
        },
        y: {
          title: {
            display: true,
            text: this.translateService.instant('SERVICES.ML.GRAPHIQUES.Y')
          }
        }

      }
    };
  }

  donneesChart(donnees: { x: Tensor; y: Tensor }) {
    const tx = donnees.x.dataSync();
    const ty = donnees.y.dataSync();
    const data: Array<{ x: number, y: number }> = [];
    tx.forEach((x, i) => data.push({x, y: ty[i]}));
    return {
      datasets: [
        {
          label: this.translateService.instant('SERVICES.ML.GRAPHIQUES.DONNEES'),
          data,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      ]
    };
  }
}
