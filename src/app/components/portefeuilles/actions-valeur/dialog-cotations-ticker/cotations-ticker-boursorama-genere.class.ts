import {DTOCotationsTickerBoursorama} from '../../../../services/boursorama/dto-cotations-ticker-boursorama.interface';
import {TranslateService} from '@ngx-translate/core';

export class CotationsTickerBoursoramaDecore {
  dto: DTOCotationsTickerBoursorama;
  pourcentageCours: number;
  variationOuverture: number;
  variationCloture: number;
  ordres?: any;

  constructor(private translateService: TranslateService, dto: DTOCotationsTickerBoursorama) {
    this.dto = dto;
    this.pourcentageCours = Math.round(100 * (dto.cours - dto.plusBas) / (dto.plusHaut - dto.plusBas));
    this.variationOuverture = (dto.cours / dto.ouverture) - 1;
    this.variationCloture = (dto.cours / dto.cloture) - 1;
    this.ordres = this.construireOrdres(dto);
  }

  private construireOrdres(dto: DTOCotationsTickerBoursorama) {
    const documentStyle = getComputedStyle(document.documentElement);
    const qtAchats = dto.achats.reduce((accumulator, achat) => accumulator + achat.quantite, 0);
    const qtVentes = dto.ventes.reduce((accumulator, vente) => accumulator + vente.quantite, 0);
    const pourcentageAchats = Math.round((qtAchats / (qtAchats + qtVentes)) * 100);
    return {
      labels: [
        this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COURS_TICKER.ACHATS', {quantite: qtAchats}),
        this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.DIALOG_COURS_TICKER.VENTES', {quantite: qtVentes})
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
}
