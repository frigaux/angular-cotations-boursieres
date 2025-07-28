import {Component, viewChild} from '@angular/core';
import {Popover} from "primeng/popover";
import {Cours} from '../../cours/cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {AchatsComponent} from '../../valeurs/valeur/achats/achats.component';
import {Panel} from 'primeng/panel';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-achat-valeur',
  imports: [
    Popover,
    TranslatePipe,
    AchatsComponent,
    Panel,
    NgIf
  ],
  templateUrl: './actions-valeur.component.html',
  styleUrl: './actions-valeur.component.sass'
})
export class ActionsValeurComponent {
  private popover = viewChild(Popover);

  // données pour la vue
  cours?: Cours;
  portefeuille?: DTOPortefeuille;
  titre?: string;
  achatsVisible: boolean = false;

  constructor(private translateService: TranslateService,
              private portefeuillesService: PortefeuillesService) {
  }

  afficher(event: MouseEvent, cours: Cours, portefeuille: DTOPortefeuille) {
    this.achatsVisible = false;
    this.cours = cours;
    this.portefeuille = portefeuille;
    this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.ACHATS_VALEUR', {'nom': this.cours.libelle});
    this.popover()?.toggle(event);
  }

  supprimerDuPortefeuille() {
    const portefeuilles = this.portefeuillesService.charger();
    const portefeuille = portefeuilles.find(p => p.nom === this.portefeuille?.nom);
    if (portefeuille) {
      portefeuille.tickers = portefeuille.tickers.filter(ticker => ticker !== this.cours?.ticker);
      this.portefeuillesService.enregistrer(portefeuilles);
    }
    this.popover()?.hide();
  }

  achats() {
    this.achatsVisible = true;
    this.popover()?.hide();
  }
}
