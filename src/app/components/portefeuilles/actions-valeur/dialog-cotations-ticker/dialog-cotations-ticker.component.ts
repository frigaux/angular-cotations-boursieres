import {Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {UIChart} from 'primeng/chart';
import {Fieldset} from 'primeng/fieldset';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {CotationsTickerBoursoramaDecore} from './cotations-ticker-boursorama-genere.class';
import {JaugeComponent} from '../../../commun/jauge/jauge.component';
import {CoursPortefeuille} from '../../cours-portefeuille.class';
import {VueUtil} from '../../../commun/vue-util.class';

@Component({
  selector: 'app-dialog-cotations-ticker',
  imports: [
    Dialog,
    LoaderComponent,
    TableModule,
    TranslatePipe,
    UIChart,
    Fieldset,
    CurrencyPipe,
    DecimalPipe,
    PercentPipe,
    DatePipe,
    JaugeComponent
  ],
  templateUrl: './dialog-cotations-ticker.component.html',
  styleUrls: ['./dialog-cotations-ticker.component.sass', '../../../commun/barre-superieure/barre-superieure.component.sass']
})
export class DialogCotationsTickerComponent {

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  cotationsTickerDecore?: CotationsTickerBoursoramaDecore;
  protected readonly VueUtil = VueUtil;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherCours(cours: CoursPortefeuille) {
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCotationsTicker(cours).subscribe(
      cotationsTickerBoursorama => {
        this.cotationsTickerDecore = new CotationsTickerBoursoramaDecore(this.translateService, 0, cotationsTickerBoursorama);
        this.loading = false;
      }
    )
  }

  afficherCotationsTickerBoursoramaDecore(cotationsTickerDecore: CotationsTickerBoursoramaDecore) {
    this.visible = true;
    this.cotationsTickerDecore = cotationsTickerDecore;
  }

  protected fermer() {
    this.visible = false;
  }

  protected rafraichir() {
    if (this.cotationsTickerDecore) {
      this.afficherCours(this.cotationsTickerDecore.dto.coursPortefeuille);
    }
  }
}
