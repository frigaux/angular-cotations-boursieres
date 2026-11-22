import {Component, viewChild} from '@angular/core';
import {Popover} from 'primeng/popover';
import {TranslatePipe} from '@ngx-translate/core';
import {CotationsValeurBoursoramaDecore} from '../../dialog-cotations-valeur/cotations-valeur-boursorama-genere.class';
import {DialogCotationsValeurComponent} from '../../dialog-cotations-valeur/dialog-cotations-valeur.component';
import {AbcBourseService} from '../../../../../services/abc-bourse/abc-bourse.service';
import {BoursoramaService} from '../../../../../services/boursorama/boursorama.service';

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
    window.open(BoursoramaService.urlCotation(this.cotationsTickerDecore?.dtoBoursorama.valeur.ticker));
    this.popover()?.hide();
  }

  protected abcBourse() {
    window.open(AbcBourseService.urlCotation(this.cotationsTickerDecore?.dtoBoursorama.valeur.ticker));
    this.popover()?.hide();
  }

  protected coursBoursorama() {
    if (this.cotationsTickerDecore && this.dialogCoursTickerComponent) {
      this.dialogCoursTickerComponent.afficherCotationsTickerBoursoramaDecore(this.cotationsTickerDecore);
      this.popover()?.hide();
    }
  }
}
