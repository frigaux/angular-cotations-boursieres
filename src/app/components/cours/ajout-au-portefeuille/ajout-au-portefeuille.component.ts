import {Component, OnInit, viewChild} from '@angular/core';
import {Popover} from 'primeng/popover';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {Select} from 'primeng/select';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-ajout-au-portefeuille',
  imports: [
    Popover,
    Select,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './ajout-au-portefeuille.component.html',
  styleUrl: './ajout-au-portefeuille.component.sass'
})
export class AjoutAuPortefeuilleComponent implements OnInit {
  private popover = viewChild(Popover);

  ticker?: string;

  // données pour la vue
  portefeuilles?: Array<DTOPortefeuille>;
  portefeuille?: DTOPortefeuille;

  constructor(private portefeuillesService: PortefeuillesService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    this.portefeuille = this.portefeuilles.find(portefeuille => portefeuille.parDefaut)
  }

  afficher(event: MouseEvent, ticker: string) {
    this.ticker = ticker;
    this.popover()?.toggle(event);
  }

  ajouterAuPortefeuille() {
    if (this.portefeuilles && this.portefeuille && this.ticker) {
      if (!this.portefeuille.tickers.includes(this.ticker)) {
        this.portefeuille.tickers.push(this.ticker);
        this.portefeuillesService.enregistrer(this.portefeuilles);
      }
    }
    this.popover()?.hide();
  }
}
