import {Component} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {CotationsTickerBoursoramaDecore} from '../dialog-cotations-ticker/cotations-ticker-boursorama-genere.class';
import {PortefeuilleAvecCours} from '../../portefeuille-avec-cours.class';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';

@Component({
  selector: 'app-dialog-cotations-tickers-portefeuille',
  imports: [
    Dialog,
    LoaderComponent,
    TranslatePipe
  ],
  templateUrl: './dialog-cotations-tickers-portefeuille.component.html',
  styleUrls: ['./dialog-cotations-tickers-portefeuille.component.sass', '../../../commun/barre-superieure/barre-superieure.component.sass']
})
export class DialogCotationsTickersPortefeuilleComponent {

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  portefeuilleAvecCours?: PortefeuilleAvecCours;
  coursTickersDecores?: Array<CotationsTickerBoursoramaDecore>;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherPortefeuille(portefeuilleAvecCours: PortefeuilleAvecCours) {
    this.portefeuilleAvecCours = portefeuilleAvecCours;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCotationsTickers(portefeuilleAvecCours.cours.map(cours => cours.ticker)).subscribe(
      cotationsTickersBoursorama => {
        this.coursTickersDecores = cotationsTickersBoursorama.map(cotationsTickerBoursorama =>
          new CotationsTickerBoursoramaDecore(this.translateService, cotationsTickerBoursorama)
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
