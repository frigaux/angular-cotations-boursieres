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
import {DTOCours} from '../../../services/cours/dto-cours.interface';
import {DTODividende} from '../../../services/dividendes/dto-dividende.interface';

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
  ordresAchats?: Array<AchatValeurDecore>;
  achats?: Array<AchatValeurDecore>;
  ordresVentes?: Array<AchatValeurDecore>;

  constructor(private dividendesService: DividendesService,
              private boursoramaService: BoursoramaService) {
  }

  afficherCours(ordresAchats: Array<AchatValeurDecore>,
                achats: Array<AchatValeurDecore>,
                ordresVentes: Array<AchatValeurDecore>) {
    this.ordresAchats = ordresAchats;
    this.achats = achats;
    this.ordresVentes = ordresVentes;

    const tickers: Set<string> = this.tickersDistinct();
    if (tickers.size > 0) {
      this.visible = true;
      this.loading = true;
      this.boursoramaService.chargerCoursTickers(Array.from(tickers))
        .subscribe(listeCours => {
          const dividendesByTicker = this.dividendesService.chargerMapByTicker();
          this.completerAchats(ordresAchats, listeCours, dividendesByTicker);
          this.completerAchats(achats, listeCours, dividendesByTicker);
          this.completerAchats(ordresVentes, listeCours, dividendesByTicker);
          this.loading = false;
        });
    }
  }

  private tickersDistinct(): Set<string> {
    const resultat = new Set<string>();
    if (this.ordresAchats && this.achats && this.ordresVentes) {
      this.ordresAchats.forEach(achat => resultat.add(achat.valeur.ticker));
      this.achats.forEach(achat => resultat.add(achat.valeur.ticker));
      this.ordresVentes.forEach(achat => resultat.add(achat.valeur.ticker));
    }
    return resultat;
  }

  private completerAchats(achats: Array<AchatValeurDecore>,
                          listeCours: Array<DTOCours>,
                          dividendesByTicker: Map<string, Array<DTODividende>> | undefined) {
    achats.forEach(achatValeurDecore => {
      const cours = listeCours.find(c => c.ticker === achatValeurDecore.valeur.ticker);
      const achatDecore = achatValeurDecore.achatDecore;
      achatDecore.cours = cours ? cours.cloture : undefined;
      achatDecore.variation = cours ? (cours.cloture / achatDecore.achat.prix) - 1 : undefined;
      achatDecore.variationBas = cours ? (cours.cloture / cours.plusBas) - 1 : undefined;
      achatDecore.variationHaut = cours ? (cours.cloture / cours.plusHaut) - 1 : undefined;
      achatValeurDecore.dividendes = dividendesByTicker?.get(achatValeurDecore.valeur.ticker) || [];
    });
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.ordresAchats && this.achats && this.ordresVentes) {
      this.afficherCours(this.ordresAchats, this.achats, this.ordresVentes);
    }
  }
}
