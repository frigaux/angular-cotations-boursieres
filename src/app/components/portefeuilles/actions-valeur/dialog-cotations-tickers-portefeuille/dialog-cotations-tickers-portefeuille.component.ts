import {Component} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {CotationsTickerBoursoramaDecore} from '../dialog-cotations-ticker/cotations-ticker-boursorama-genere.class';
import {PortefeuilleAvecCours} from '../../portefeuille-avec-cours.class';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {JaugeComponent} from '../../../commun/jauge/jauge.component';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {UIChart} from 'primeng/chart';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-dialog-cotations-tickers-portefeuille',
  imports: [
    Dialog,
    LoaderComponent,
    TranslatePipe,
    JaugeComponent,
    PercentPipe,
    UIChart,
    CurrencyPipe,
    TableModule
  ],
  templateUrl: './dialog-cotations-tickers-portefeuille.component.html',
  styleUrls: ['./dialog-cotations-tickers-portefeuille.component.sass', '../../../commun/barre-superieure/barre-superieure.component.sass']
})
export class DialogCotationsTickersPortefeuilleComponent {

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  portefeuilleAvecCours?: PortefeuilleAvecCours;
  cotationsTickersDecores?: Array<CotationsTickerBoursoramaDecore>;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherPortefeuille(portefeuilleAvecCours: PortefeuilleAvecCours) {
    this.portefeuilleAvecCours = portefeuilleAvecCours;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCotationsTickers(portefeuilleAvecCours.cours).subscribe(
      cotationsTickersBoursorama => {
        let i = 0;
        this.cotationsTickersDecores = cotationsTickersBoursorama.map(cotationsTickerBoursorama =>
          new CotationsTickerBoursoramaDecore(this.translateService, i++, cotationsTickerBoursorama)
        );
        this.loading = false;
      }
    )
  }

  evolutionVariation(variation: number): string {
    return variation >= 0 ? 'positive' : 'negative';
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.portefeuilleAvecCours) {
      this.afficherPortefeuille(this.portefeuilleAvecCours);
    }
  }
}
