import {Component, input, InputSignal, output} from '@angular/core';
import {AchatValeurDecore} from '../tableau-achats/achat-valeur-decore.class';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {ColonneDividendesComponent} from '../../portefeuilles/colonnes/dividendes/colonne-dividendes.component';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {ClassVariation} from '../../../directives/class-variation';

@Component({
  selector: 'app-tableau-ventes',
  imports: [
    ColonneDividendesComponent,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    TableModule,
    TranslatePipe,
    ClassVariation
  ],
  templateUrl: './tableau-ventes.component.html',
  styleUrls: ['./tableau-ventes.component.sass', '../tableau-achats/tableau-achats.component.sass']
})
export class TableauVentesComponent {
  // input/output
  inputAchats: InputSignal<Array<AchatValeurDecore> | undefined> = input(undefined,
    {transform: o => this.intercepteurAchats(o), alias: 'achats'});
  suppression = output<{ event: MouseEvent, achatValeurDecore: AchatValeurDecore }>();

  // données pour la vue
  achatValeurDecores?: Array<AchatValeurDecore>;
  totalQuantite: number = 0;
  totauxAchats: number = 0;
  variationAchats: number = 0;
  totauxVentes: number = 0;

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
    this.calculerTotaux(listeAchats);
    return listeAchats;
  }

  private calculerTotaux(listeAchats: Array<AchatValeurDecore> | undefined) {
    this.totalQuantite = 0;
    this.totauxAchats = 0;
    this.variationAchats = 0;
    this.totauxVentes = 0;
    if (listeAchats) {
      this.achatValeurDecores!.forEach(achatValeurDecore => {
        const achat = achatValeurDecore.achatDecore.achat;
        this.totalQuantite += achat.quantite;
        this.totauxAchats += achat.prix * achat.quantite;
        if (achat.dateRevente && achat.prixRevente) {
          this.totauxVentes += achat.prixRevente * achat.quantite;
        } else {
          console.error('Achat revendu sans date de revente ou prix de revente : ', achat);
        }
      });
      this.variationAchats = (this.totauxVentes / this.totauxAchats) - 1;
    }
  }

  suppressionAchat(event: PointerEvent, achatValeurDecore: AchatValeurDecore) {
    this.suppression.emit({event, achatValeurDecore});
  }
}
