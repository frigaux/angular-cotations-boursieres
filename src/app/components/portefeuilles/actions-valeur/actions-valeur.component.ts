import {Component, viewChild} from '@angular/core';
import {Popover} from "primeng/popover";
import {Cours} from '../../cours/cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {AchatsValeurComponent} from '../../valeurs/details-valeur/achats-valeur/achats-valeur.component';
import {Panel} from 'primeng/panel';
import {NgIf} from '@angular/common';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';

// TODO : demander confirmation suppression
@Component({
  selector: 'app-achat-valeur',
  imports: [
    Popover,
    TranslatePipe,
    AchatsValeurComponent,
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
              private portefeuillesService: PortefeuillesService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  afficher(event: MouseEvent, cours: Cours, portefeuille: DTOPortefeuille) {
    this.achatsVisible = false;
    this.cours = cours;
    this.portefeuille = portefeuille;
    this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.ACHATS_VALEUR', {'nom': this.cours.libelle});
    this.popover()?.toggle(event);
  }

  suppressionDuPortefeuille(event: Event) {
    if (this.portefeuille && this.cours) {
      this.dialogueService.confirmationSuppression(
        this.confirmationService,
        event,
        this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.CONFIRMATION_SUPPRESSION',
          {'valeur': this.cours.libelle, 'nomPortefeuille': this.portefeuille.nom}),
        () => {
          this.supprimerDuPortefeuille();
        }
      );
    }
  }

  supprimerDuPortefeuille() {
    if (this.portefeuille && this.cours) {
      const portefeuilles = this.portefeuillesService.charger();
      const portefeuille = portefeuilles.find(p => p.nom === this.portefeuille!.nom);
      if (portefeuille) {
        portefeuille.tickers.splice(portefeuille.tickers.indexOf(this.cours.ticker), 1);
        this.portefeuillesService.enregistrer(portefeuilles);
      }
    }
    this.popover()?.hide();
  }

  achats() {
    this.achatsVisible = true;
    this.popover()?.hide();
  }
}
