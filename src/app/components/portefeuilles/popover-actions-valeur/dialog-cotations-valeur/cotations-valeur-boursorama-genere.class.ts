import {DTOCotationsTickerBoursorama} from '../../../../services/boursorama/dto-cotations-ticker-boursorama.interface';
import {TranslateService} from '@ngx-translate/core';

export class CotationsValeurBoursoramaDecore {
  id: number;
  dto: DTOCotationsTickerBoursorama;
  pourcentageCours: number;
  variationOuverture: number;
  variationClotureVeille: number;
  ordresDoughnut?: any;
  ordresBarChart?: any;
  optionsBarChart?: any;

  constructor(private translateService: TranslateService, id: number, dto: DTOCotationsTickerBoursorama) {
    this.id = id;
    this.dto = dto;
    this.pourcentageCours = Math.round(100 * (dto.cours - dto.plusBas) / (dto.plusHaut - dto.plusBas));
    this.variationOuverture = (dto.cours / dto.ouverture) - 1;
    this.variationClotureVeille = (dto.cours / dto.clotureVeille) - 1;
    this.ordresDoughnut = this.construireOrdresDoughnut(dto);
    this.ordresBarChart = this.construireOrdresBarChart(dto);
    this.optionsBarChart = this.construireOptionsBarChart();
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

  private construireOrdresDoughnut(dto: DTOCotationsTickerBoursorama) {
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

  private construireOrdresBarChart(dto: DTOCotationsTickerBoursorama) {
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
}
