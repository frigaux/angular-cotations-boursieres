import {
  DTOInformationsTickerBoursorama
} from '../../../../services/boursorama/dto-informations-ticker-boursorama.interface';
import {TranslateService} from '@ngx-translate/core';
import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';

export class CotationsValeurBoursoramaDecore {
  id: number;
  dto: DTOInformationsTickerBoursorama;
  pourcentageCours: number;
  variationOuverture: number;
  variationClotureVeille: number;
  dividendes?: Array<DTODividende>;
  ordresDataDoughnut?: any;
  ordresDataBarChart?: any;
  ordresOptionsBarChart: any;
  coursDataChartLine: any;
  coursOptionsChartLine: any; // https://www.chartjs.org/

  constructor(private translateService: TranslateService,
              id: number, dto: DTOInformationsTickerBoursorama,
              dividendes: Array<DTODividende> | undefined) {
    this.id = id;
    this.dto = dto;
    this.pourcentageCours = Math.round(100 * (dto.cotations.cours - dto.cotations.plusBas) / (dto.cotations.plusHaut - dto.cotations.plusBas));
    this.variationOuverture = (dto.cotations.cours / dto.cotations.ouverture) - 1;
    this.variationClotureVeille = (dto.cotations.cours / dto.cotations.clotureVeille) - 1;
    this.dividendes = dividendes;
    this.ordresDataDoughnut = this.construireOrdresDoughnut(dto);
    this.ordresDataBarChart = this.construireOrdresBarChart(dto);
    this.ordresOptionsBarChart = this.construireOptionsBarChart();
    this.coursDataChartLine = this.wrapCoursDataChartLine(dto);
    this.coursOptionsChartLine = this.wrapCoursOptionsChartLine();
  }

  private construireOptionsBarChart() {
    return {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false
        }
      }
    };
  }

  private construireOrdresDoughnut(dto: DTOInformationsTickerBoursorama) {
    const documentStyle = getComputedStyle(document.documentElement);
    const qtAchats = dto.achats.reduce((accumulator, achat) => accumulator + achat.quantite, 0);
    const qtVentes = dto.ventes.reduce((accumulator, vente) => accumulator + vente.quantite, 0);
    const pourcentageAchats = Math.round((qtAchats / (qtAchats + qtVentes)) * 100);
    return {
      labels: [
        this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COTATIONS_VALEUR.ACHATS', {quantite: qtAchats}),
        this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COTATIONS_VALEUR.VENTES', {quantite: qtVentes})
      ],
      datasets: [
        {
          data: [pourcentageAchats, 100 - pourcentageAchats],
          backgroundColor: [documentStyle.getPropertyValue('--p-green-500'), documentStyle.getPropertyValue('--p-red-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--p-green-400'), documentStyle.getPropertyValue('--p-red-400')]
        }
      ]
    };

  }

  private construireOrdresBarChart(dto: DTOInformationsTickerBoursorama) {
    const documentStyle = getComputedStyle(document.documentElement);
    const qtAchats = dto.achats.reduce((accumulator, achat) => accumulator + achat.quantite, 0);
    const qtVentes = dto.ventes.reduce((accumulator, vente) => accumulator + vente.quantite, 0);
    return {
      labels: [''],
      datasets: [
        {
          label: this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COTATIONS_VALEURS_PORTEFEUILLE.ACHATS'),
          backgroundColor: documentStyle.getPropertyValue('--p-green-500'),
          borderColor: documentStyle.getPropertyValue('--p-green-700'),
          data: [qtAchats]
        },
        {
          label: this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COTATIONS_VALEURS_PORTEFEUILLE.VENTES'),
          backgroundColor: documentStyle.getPropertyValue('--p-red-500'),
          borderColor: documentStyle.getPropertyValue('--p-red-700'),
          data: [qtVentes]
        }
      ]
    };
  }

  private wrapCoursDataChartLine(dto: DTOInformationsTickerBoursorama) {
    const labels: Array<string> = [];
    const data: Array<number> = [];

    dto.cours.forEach((item: { label: string, data: number }) => {
      labels.push(item.label);
      data.push(item.data);
    });
    return {
      labels,
      datasets: [
        {
          label: this.translateService.instant('SERVICES.BOURSORAMA.COURS'),
          data,
          tension: 0.4
        }
      ]
    };
  }

  private wrapCoursOptionsChartLine() {
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
        legend: {
          display: false
        },
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
}
