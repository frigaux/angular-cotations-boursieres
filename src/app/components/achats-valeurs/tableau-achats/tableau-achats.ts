import {Component, input, InputSignal, output} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {AchatsValeurDecores} from '../achats-valeur-decores.class';
import {AchatDecore} from '../../valeurs/details-valeur/achats-valeur/achat-decore.class';

@Component({
  selector: 'app-tableau-achats',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    TranslatePipe
  ],
  templateUrl: './tableau-achats.html',
  styleUrl: './tableau-achats.sass'
})
export class TableauAchats {
  inputAchats: InputSignal<Array<AchatsValeurDecores> | undefined> = input(undefined,
    {transform: o => this.intercepteurAchats(o), alias: 'achats'});
  suppression = output<{event: MouseEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore}>();
  revente = output<{event: MouseEvent, achatsValeurDecores: AchatsValeurDecores, achatDecore: AchatDecore}>();

  // données pour la vue
  achatsValeursDecores?: Array<AchatsValeurDecores>;
  totalQuantite: number = 0;
  totaux: number = 0;

  private intercepteurAchats(achats: Array<AchatsValeurDecores> | undefined) {
    this.achatsValeursDecores = achats;
    this.calculerTotaux();
    return achats;
  }

  private calculerTotaux() {
    if (this.achatsValeursDecores) {
      this.totalQuantite = 0;
      this.totaux = 0;
      this.achatsValeursDecores.forEach(achatsValeurDecores => {
        achatsValeurDecores.achatsTicker.achats
          .forEach(achat => {
            this.totalQuantite += achat.quantite;
            this.totaux += achat.prix * achat.quantite;
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
}
