import {Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {UIChart} from 'primeng/chart';
import {Fieldset} from 'primeng/fieldset';
import {CurrencyPipe, DatePipe, DecimalPipe, JsonPipe, PercentPipe} from '@angular/common';
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
    JaugeComponent,
    JsonPipe
  ],
  templateUrl: './dialog-cotations-ticker.component.html',
  styleUrls: ['./dialog-cotations-ticker.component.sass', '../../../commun/barre-superieure.sass']
})
export class DialogCotationsTickerComponent {

  // données pour la vue
  protected visible: boolean = false;
  protected loading: boolean = false;
  protected cours?: CoursPortefeuille;
  protected cotationsTickerDecore?: CotationsTickerBoursoramaDecore;
  protected readonly VueUtil = VueUtil;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherCours(cours: CoursPortefeuille) {
    this.cours = cours;
    this.cotationsTickerDecore = undefined;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCotationsTicker(cours).subscribe({
        next:
          cotationsTickerBoursorama => {
            this.cotationsTickerDecore = new CotationsTickerBoursoramaDecore(this.translateService, 0, cotationsTickerBoursorama);
            this.loading = false;
          },
      error:
        httpErrorResponse => this.loading = false
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
    if (this.cours) {
      this.afficherCours(this.cours);
    }
  }
}
