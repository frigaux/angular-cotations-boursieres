import {Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../../loader/loader.component';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Cours} from '../../../cours/cours.class';
import {BoursoramaService} from '../../../../services/boursorama/boursorama.service';
import {UIChart} from 'primeng/chart';
import {Fieldset} from 'primeng/fieldset';
import {CurrencyPipe, DecimalPipe, NgClass, PercentPipe} from '@angular/common';
import {CotationsTickerBoursoramaDecore} from './cotations-ticker-boursorama-genere.class';

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
    NgClass
  ],
  templateUrl: './dialog-cotations-ticker.component.html',
  styleUrl: './dialog-cotations-ticker.component.sass'
})
export class DialogCotationsTickerComponent {

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  cours?: Cours;
  coursBoursoramaDecore?: CotationsTickerBoursoramaDecore;

  constructor(private translateService: TranslateService, private boursoramaService: BoursoramaService) {
  }

  afficherCours(cours: Cours) {
    this.cours = cours;
    this.visible = true;
    this.loading = true;
    this.boursoramaService.chargerCoursTicker(cours.ticker).subscribe(
      coursBoursorama => {
        this.coursBoursoramaDecore = new CotationsTickerBoursoramaDecore(this.translateService, coursBoursorama);
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
