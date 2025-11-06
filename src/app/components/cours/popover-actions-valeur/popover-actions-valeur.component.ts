import {Component, OnInit, viewChild} from '@angular/core';
import {Popover} from 'primeng/popover';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {Select} from 'primeng/select';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-popover-actions-valeur',
  imports: [
    Popover,
    Select,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './popover-actions-valeur.component.html',
  styleUrls: ['./popover-actions-valeur.component.sass', '../../portefeuilles/popover-actions-valeur/popover-actions-valeur.component.sass']
})
export class PopoverActionsValeurComponent implements OnInit {
  private popover = viewChild(Popover);

  ticker?: string;

  // données pour la vue
  portefeuilles?: Array<DTOPortefeuille>;
  portefeuilleSelectionne?: DTOPortefeuille;

  constructor(private portefeuillesService: PortefeuillesService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuilleSelectionne = this.portefeuilles.find(portefeuille => portefeuille.parDefaut)
  }

  /**
   *
   * @param event
   * @param ticker le ticker doit appartenir à la liste renvoyée par ValeursService.chargerValeurs
   */
  afficher(event: MouseEvent, ticker: string) {
    this.ticker = ticker;
    this.popover()?.toggle(event);
  }

  ajouterAuPortefeuille() {
    if (this.portefeuilles && this.portefeuilleSelectionne && this.ticker) {
      if (!this.portefeuilleSelectionne.tickers.includes(this.ticker)) {
        this.portefeuilleSelectionne.tickers.push(this.ticker);
        this.portefeuillesService.enregistrer(this.portefeuilles);
      }
    }
    this.popover()?.hide();
  }

  protected boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.ticker}/`);
    this.popover()?.hide();
  }

  protected abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.ticker}p`);
    this.popover()?.hide();
  }
}
