import {Component, input, InputSignal, output} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {CoursService} from '../../../services/cours/cours.service';
import {TableModule} from 'primeng/table';
import {AchatValeurDecore} from './achat-valeur-decore.class';
import {ColonneDividendesComponent} from '../../portefeuilles/colonnes/dividendes/colonne-dividendes.component';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {LoaderComponent} from '../../loader/loader.component';

@Component({
  selector: 'app-tableau-achats-non-revendus',
  imports: [
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    TranslatePipe,
    PercentPipe,
    TableModule,
    ColonneDividendesComponent,
    LoaderComponent
  ],
  templateUrl: './tableau-achats-non-revendus.component.html',
  styleUrl: './tableau-achats-non-revendus.component.sass'
})
export class TableauAchatsNonRevendusComponent {
  // chargement des cours
  loading: boolean = true;

  // input/output
  inputAchats: InputSignal<Array<AchatValeurDecore> | undefined> = input(undefined,
    {transform: o => this.intercepteurAchats(o), alias: 'achats'});
  suppression = output<{ event: MouseEvent, achatValeurDecore: AchatValeurDecore }>();

  // données pour la vue
  achatValeurDecores?: Array<AchatValeurDecore>;
  totalQuantite: number = 0;
  totauxAchats: number = 0;
  variationAchats: number = 0;
  totauxClotures: number = 0;


  constructor(private coursService: CoursService,
              private dividendesService: DividendesService) {
  }

  private intercepteurAchats(listeAchats: Array<AchatValeurDecore> | undefined) {
    this.achatValeurDecores = listeAchats;
    if (listeAchats) {
      this.loading = true;
      this.calculerTotaux();
      this.recupererCours();
    }
    return listeAchats;
  }

  private calculerTotaux() {
    this.totalQuantite = 0;
    this.totauxAchats = 0;
    this.achatValeurDecores!.forEach(achatValeurDecore => {
      const achat = achatValeurDecore.achatDecore.achat;
      this.totalQuantite += achat.quantite;
      this.totauxAchats += achat.prix * achat.quantite;
    });
  }

  private recupererCours() {
    const tickers = Array.from(new Set(this.achatValeurDecores!.map(achat => achat.valeur.ticker)));
    this.totauxClotures = 0;
    this.coursService.chargerCoursTickersWithLimit(tickers, 1)
      .subscribe(liste => {
          liste.forEach(cours => {
            const achats: Array<AchatValeurDecore> = this.achatValeurDecores!.filter(achat => achat.valeur.ticker === cours.ticker);
            achats.forEach(achatValeurDecore => {
              achatValeurDecore.achatDecore.cours = cours.cloture;
              achatValeurDecore.achatDecore.variationAchat = (cours.cloture / achatValeurDecore.achatDecore.achat.prix) - 1;
              this.totauxClotures += cours.cloture * achatValeurDecore.achatDecore.achat.quantite;
            });
          });
          this.variationAchats = (this.totauxClotures / this.totauxAchats) - 1;
          const dividendesByTicker = this.dividendesService.chargerMapByTicker();
          this.achatValeurDecores!.forEach(achatValeurDecore => {
            achatValeurDecore.dividendes = dividendesByTicker?.get(achatValeurDecore.valeur.ticker) || [];
          });
          this.loading = false;
        }
      );
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
