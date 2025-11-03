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
import {DialogCotationsTickerComponent} from '../dialog-cotations-ticker/dialog-cotations-ticker.component';
import {VueUtil} from '../../../commun/vue-util.class';

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
  styleUrls: ['./dialog-cotations-tickers-portefeuille.component.sass', '../../../commun/barre-superieure.sass']
})
export class DialogCotationsTickersPortefeuilleComponent {

  private dialogCoursTickerComponent?: DialogCotationsTickerComponent;

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  portefeuilleAvecCours?: PortefeuilleAvecCours;
  cotationsTickersDecores?: Array<CotationsTickerBoursoramaDecore>;
  protected readonly VueUtil = VueUtil;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherPortefeuille(portefeuilleAvecCours: PortefeuilleAvecCours, dialogCoursTickerComponent?: DialogCotationsTickerComponent) {
    this.portefeuilleAvecCours = portefeuilleAvecCours;
    this.dialogCoursTickerComponent = dialogCoursTickerComponent;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCotationsTickers(portefeuilleAvecCours.cours).subscribe({
        next:
          cotationsTickersBoursorama => {
            let i = 0;
            this.cotationsTickersDecores = cotationsTickersBoursorama.map(cotationsTickerBoursorama =>
              new CotationsTickerBoursoramaDecore(this.translateService, i++, cotationsTickerBoursorama)
            );
            this.loading = false;
          },
        error:
          httpErrorResponse => this.loading = false
      }
    )
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.portefeuilleAvecCours && this.dialogCoursTickerComponent) {
      this.afficherPortefeuille(this.portefeuilleAvecCours, this.dialogCoursTickerComponent);
    }
  }

  protected vueDetaillee(cotationsTickerDecore: CotationsTickerBoursoramaDecore) {
    if (this.dialogCoursTickerComponent) {
      this.dialogCoursTickerComponent.afficherCotationsTickerBoursoramaDecore(cotationsTickerDecore);
    }
  }
}
