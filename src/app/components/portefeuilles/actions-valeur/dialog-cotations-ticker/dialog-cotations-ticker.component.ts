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
  cours?: CoursPortefeuille;
  cotationsTickerDecore?: CotationsTickerBoursoramaDecore;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherCours(cours: CoursPortefeuille) {
    this.cours = cours;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCotationsTicker(cours).subscribe(
      cotationsTickerBoursorama => {
        this.cotationsTickerDecore = new CotationsTickerBoursoramaDecore(this.translateService, 0, cotationsTickerBoursorama);
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
    if (this.cours) {
      this.afficherCours(this.cours);
    }
  }
}
