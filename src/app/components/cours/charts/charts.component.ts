import {Component, input, InputSignal} from '@angular/core';
import {Cours} from '../cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {DatePipe, PercentPipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {RadioButton} from 'primeng/radiobutton';
import {FormsModule} from '@angular/forms';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {EtapeValeurUtil} from '../../valeurs/achats-valeur/etape-valeur-util.class';
import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';

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

  constructor(private translateService: TranslateService,
              private valeursService: ValeursService,
              private datepipe: DatePipe,
              private percentPipe: PercentPipe) {
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
    const titleCours = this.translateService.instant('COMPOSANTS.COURS.CHARTS.TITLE_COURS');
    const titleMM = this.translateService.instant('COMPOSANTS.COURS.CHARTS.TITLE_MM');
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
                return `${titleCours} ${dot.label}`;
              } else if (dot.datasetIndex === 1) {
                return `${titleMM}${dot.dataset.data.length - dot.dataIndex}`;
              } else {
                return dot.dataset.label;
              }
            },
            label: function (context: any) {
              if (context.datasetIndex < 2) {
                return `${formatCurrency(context.parsed.y)} (${formatPercent(1 - (cloture / context.raw))})`;
              } else {
                return `${formatCurrency(context.parsed.y)}`;
              }
            }
          }
        }
      }
    };
  }

  private wrapData(labels: string[], dataCours: number[], dataMM: number[]) {
    const resultat = {
      labels,
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.COURS.CHARTS.COURS'),
          data: dataCours,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        },
        {
          label: this.translateService.instant('COMPOSANTS.COURS.CHARTS.MOYENNES_MOBILES') + labels[labels.length - 1],
          data: dataMM,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      ]
    };
    if (this.cours) {
      const listeAchats = this.valeursService.chargerAchatsTicker(this.cours.ticker);
      const ordresChats = listeAchats.filter(achat => EtapeValeurUtil.isOrdreAchat(achat));
      this.ajouterDataset(ordresChats, dataCours, resultat.datasets, a => a.prix, 'ORDRES_ACHATS');
      const achats = listeAchats.filter(achat => EtapeValeurUtil.isAchat(achat));
      this.ajouterDataset(achats, dataCours, resultat.datasets, a => a.prix, 'ACHATS');
      const ordresVentes = listeAchats.filter(achat => EtapeValeurUtil.isOrdreVente(achat));
      this.ajouterDataset(ordresVentes, dataCours, resultat.datasets, a => a.prixRevente!, 'ORDRES_VENTES');
    }
    return resultat;
  }

  private ajouterDataset(achats: DTOAchat[], dataCours: number[], datasets: Array<any>,
                         val: (a: DTOAchat) => number, key: string) {
    if (achats.length > 0) {
      const valeur = achats
          .reduce((accumulator, achat) => accumulator + val(achat), 0)
        / achats.length;
      const data = Array.from({length: dataCours.length}, (v, k) => valeur);
      datasets.push(
        {
          label: this.translateService.instant(`COMPOSANTS.COURS.CHARTS.${key}`),
          data,
          tension: 0.4 // Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used.
        }
      );
    }
  }
}
