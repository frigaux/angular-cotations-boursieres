import {Component, input, InputSignal, output} from '@angular/core';
import {AchatValeurDecore} from '../tableau-achats-non-revendus/achat-valeur-decore.class';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {ColonneDividendesComponent} from '../../portefeuilles/colonnes/dividendes/colonne-dividendes.component';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-tableau-achats-revendus',
  imports: [
    ColonneDividendesComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    TableModule,
    TranslatePipe
  ],
  templateUrl: './tableau-achats-revendus.component.html',
  styleUrls: ['./tableau-achats-revendus.component.sass', '../tableau-achats-non-revendus/tableau-achats-non-revendus.component.sass']
})
export class TableauAchatsRevendusComponent {
  // input/output
  inputAchats: InputSignal<Array<AchatValeurDecore> | undefined> = input(undefined,
    {transform: o => this.intercepteurAchats(o), alias: 'achats'});
  suppression = output<{ event: MouseEvent, achatValeurDecore: AchatValeurDecore }>();

  // données pour la vue
  achatValeurDecores?: Array<AchatValeurDecore>;

  constructor(private dividendesService: DividendesService) {
  }

  private intercepteurAchats(listeAchats: Array<AchatValeurDecore> | undefined) {
    if (listeAchats) {
      const dividendesByTicker = this.dividendesService.chargerMapByTicker();
      listeAchats!.forEach(achatValeurDecore => {
        achatValeurDecore.achatDecore.variationAchat = (achatValeurDecore.achatDecore.achat.prixRevente! / achatValeurDecore.achatDecore.achat.prix) - 1;
        achatValeurDecore.dividendes = dividendesByTicker?.get(achatValeurDecore.valeur.ticker) || [];
      });
    }
    this.achatValeurDecores = listeAchats;
    return listeAchats;
  }

  suppressionAchat(event: PointerEvent, achatValeurDecore: AchatValeurDecore) {
    this.suppression.emit({event, achatValeurDecore});
  }

  evolutionVariation(variation?: number): string {
    if (variation === undefined) {
      return '';
    }
    return variation >= 0 ? 'positive' : 'negative';
  }
}
