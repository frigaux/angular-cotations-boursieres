import {Component, input, InputSignal, output} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {AchatsValeurDecores} from '../achats-valeur-decores.class';
import {AchatDecore} from '../../valeurs/details-valeur/achats-valeur/achat-decore.class';
import {CoursService} from '../../../services/cours/cours.service';

@Component({
  selector: 'app-tableau-achats',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    PercentPipe
  ],
  templateUrl: './tableau-achats.html',
  styleUrl: './tableau-achats.sass'
})
export class TableauAchats {
  inputAchats: InputSignal<Array<AchatsValeurDecores> | undefined> = input(undefined,
    {transform: o => this.intercepteurAchats(o), alias: 'achats'});
  suppression = output<{ event: MouseEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore }>();
  revente = output<{ event: MouseEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore }>();

  // données pour la vue
  achatsValeursDecores?: Array<AchatsValeurDecores>;
  totalQuantite: number = 0;
  totauxAchats: number = 0;
  totauxClotures: number = 0;

  constructor(private coursService: CoursService) {
  }

  private intercepteurAchats(achats: Array<AchatsValeurDecores> | undefined) {
    this.achatsValeursDecores = achats;
    this.calculerTotaux();
    this.recupererCours();
    return achats;
  }

  private calculerTotaux() {
    if (this.achatsValeursDecores) {
      this.totalQuantite = 0;
      this.totauxAchats = 0;
      this.achatsValeursDecores.forEach(achatsValeurDecores => {
        achatsValeurDecores.achatsTicker.achats
          .forEach(achat => {
            this.totalQuantite += achat.quantite;
            this.totauxAchats += achat.prix * achat.quantite;
          })
      });
    }
  }

  suppressionAchat(event: PointerEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore) {
    this.suppression.emit({event, achatsValeurDecores, achatDecore});
  }

  reventeAchat(event: PointerEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore) {
    this.revente.emit({event, achatsValeurDecores, achatDecore});
  }

  private recupererCours() {
    if (this.achatsValeursDecores) {
      const tickers = this.achatsValeursDecores.map(achat => achat.valeur.ticker);
      this.totauxClotures = 0;
      // chargement des trois dernières colonnes du tableau (sans loader)
      this.coursService.chargerCoursTickersWithLimit(tickers, 1)
        .subscribe(liste => {
          liste.forEach(cours => {
            const achats = this.achatsValeursDecores!.find(achats => achats.valeur.ticker === cours.ticker);
            if (achats) {
              achats.achatsDecores.forEach(achatDecore => {
                achatDecore.cloture = cours.cloture;
                achatDecore.variation = (cours.cloture / achatDecore.achat.prix) - 1;
                this.totauxClotures += cours.cloture * achatDecore.achat.quantite;
              });
            }
          });
        });
    }
  }

  evolutionVariation(variation?: number): string {
    if (variation === undefined) {
      return '';
    }
    return variation >= 0 ? 'positive' : 'negative';
  }
}
