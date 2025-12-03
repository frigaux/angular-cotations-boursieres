import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ColonneDividendesComponent} from '../../../portefeuilles/colonnes/dividendes/colonne-dividendes.component';
import {JaugeComponent} from '../../../commun/jauge/jauge.component';
import {ClassVariation} from '../../../../directives/class-variation';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {AchatValeurDecore} from '../../tableau-achats/achat-valeur-decore.class';
import {EtapeValeur} from '../../../valeurs/achats-valeur/etape-valeur.enum';

@Component({
  selector: 'app-tableau-achats',
  imports: [
    TranslatePipe,
    ColonneDividendesComponent,
    JaugeComponent,
    ClassVariation,
    PercentPipe,
    CurrencyPipe,
    TableModule
  ],
  templateUrl: './tableau-achats.component.html',
  styleUrl: './tableau-achats.component.sass',
})
export class TableauAchatsComponent {
  inputAchats: InputSignal<{ achats: Array<AchatValeurDecore>, etape: EtapeValeur } | undefined> = input(undefined,
    {transform: o => this.intercepteurAchats(o), alias: 'achats'});

  // données pour la vue
  achats?: Array<AchatValeurDecore>;
  etape?: EtapeValeur;
  protected readonly EtapeValeur = EtapeValeur;

  private intercepteurAchats(achats: { achats: Array<AchatValeurDecore>, etape: EtapeValeur } | undefined) {
    if (achats) {
      achats.achats.forEach(achatValeurDecore => {
        const achatDecore = achatValeurDecore.achatDecore;
        switch (achats.etape) {
          case EtapeValeur.ORDRE_ACHAT:
            achatDecore.variation = achatDecore.cours ? (achatDecore.achat.prix / achatDecore.cours) - 1 : undefined;
            break;
          case EtapeValeur.ACHAT:
            achatDecore.variation = achatDecore.cours ? (achatDecore.cours / achatDecore.achat.prix) - 1 : undefined;
            break;
          case EtapeValeur.ORDRE_VENTE:
            achatDecore.variation = achatDecore.cours ? (achatDecore.cours / achatDecore.achat.prixRevente!) - 1 : undefined;
            break;
        }
      });
      this.achats = achats.achats;
      this.etape = achats.etape;
    } else {
      this.achats = undefined;
      this.etape = undefined;
    }
    return achats;
  }
}
