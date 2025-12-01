import {Component} from '@angular/core';
import {AchatValeurDecore} from '../tableau-achats/achat-valeur-decore.class';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {TranslatePipe} from '@ngx-translate/core';
import {LoaderComponent} from '../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {ColonneDividendesComponent} from '../../portefeuilles/colonnes/dividendes/colonne-dividendes.component';
import {Dialog} from 'primeng/dialog';
import {ClassVariation} from '../../../directives/class-variation';

@Component({
  selector: 'app-dialog-cours-achats',
  imports: [
    TranslatePipe,
    LoaderComponent,
    TableModule,
    CurrencyPipe,
    PercentPipe,
    ColonneDividendesComponent,
    Dialog,
    ClassVariation
  ],
  templateUrl: './dialog-cours-achats.component.html',
  styleUrls: ['./dialog-cours-achats.component.sass', '../../commun/barre-superieure.sass']
})
export class DialogCoursAchatsComponent {
  // données pour la vue
  visible: boolean = false;
  loading: boolean = true; // chargement des cours depuis Boursorama
  coursNonRevendus?: Array<AchatValeurDecore>;

  // private
  listeAchatsNonRevendus?: Array<AchatValeurDecore>;

  constructor(private dividendesService: DividendesService,
              private boursoramaService: BoursoramaService) {
  }

  afficherCours(listeAchatsNonRevendus: Array<AchatValeurDecore>) {
    this.listeAchatsNonRevendus = listeAchatsNonRevendus;
    this.visible = true;
    if (listeAchatsNonRevendus.length > 0) {
      this.loading = true;
      const tickers = Array.from(new Set(listeAchatsNonRevendus.map(achat => achat.valeur.ticker)));
      this.coursNonRevendus = JSON.parse(JSON.stringify(listeAchatsNonRevendus));
      this.boursoramaService.chargerCoursTickers(tickers)
        .subscribe(listeCours => {
          this.coursNonRevendus!.forEach(achatValeurDecore => {
            const cours = listeCours.find(c => c.ticker === achatValeurDecore.valeur.ticker);
            const achatDecore = achatValeurDecore.achatDecore;
            achatDecore.cours = cours ? cours.cloture : undefined;
            achatDecore.variationAchat = cours ? (cours.cloture / achatDecore.achat.prix) - 1 : undefined;
            achatDecore.variationBas = cours ? (cours.cloture / cours.plusBas) - 1 : undefined;
            achatDecore.variationHaut = cours ? (cours.cloture / cours.plusHaut) - 1 : undefined;
          });
          const dividendesByTicker = this.dividendesService.chargerMapByTicker();
          this.coursNonRevendus!.forEach(achatValeurDecore => {
            achatValeurDecore.dividendes = dividendesByTicker?.get(achatValeurDecore.valeur.ticker) || [];
          });
          this.loading = false;
        });
    }
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.listeAchatsNonRevendus) {
      this.afficherCours(this.listeAchatsNonRevendus);
    }
  }
}
