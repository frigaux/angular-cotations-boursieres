import {Component, viewChild} from '@angular/core';
import {Popover} from 'primeng/popover';
import {TranslatePipe} from '@ngx-translate/core';
import {CotationsValeurBoursoramaDecore} from '../../dialog-cotations-valeur/cotations-valeur-boursorama-genere.class';
import {DialogCotationsValeurComponent} from '../../dialog-cotations-valeur/dialog-cotations-valeur.component';

@Component({
  selector: 'app-popover-actions-valeur',
  imports: [
    Popover,
    TranslatePipe
  ],
  templateUrl: './popover-actions-valeur.component.html',
  styleUrls: ['./popover-actions-valeur.component.sass', '../../popover-actions-valeur.component.sass']
})
export class PopoverActionsValeurComponent {
  private popover = viewChild(Popover);

  // données pour la vue
  cotationsTickerDecore?: CotationsValeurBoursoramaDecore;

  // private
  private dialogCoursTickerComponent?: DialogCotationsValeurComponent;

  afficher(event: MouseEvent, cotationsTickerDecore: CotationsValeurBoursoramaDecore, dialogCoursTickerComponent?: DialogCotationsValeurComponent) {
    this.cotationsTickerDecore = cotationsTickerDecore;
    this.dialogCoursTickerComponent = dialogCoursTickerComponent;
    this.popover()?.toggle(event);
  }

  protected boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cotationsTickerDecore?.dtoBoursorama.valeur.ticker}/`);
    this.popover()?.hide();
  }

  protected abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cotationsTickerDecore?.dtoBoursorama.valeur.ticker}p`);
    this.popover()?.hide();
  }

  protected coursBoursorama() {
    if (this.cotationsTickerDecore && this.dialogCoursTickerComponent) {
      this.dialogCoursTickerComponent.afficherCotationsTickerBoursoramaDecore(this.cotationsTickerDecore);
      this.popover()?.hide();
    }
  }
}
