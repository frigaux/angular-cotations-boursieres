import {Component, viewChild} from '@angular/core';
import {Popover} from "primeng/popover";
import {Cours} from '../../cours/cours.class';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {AchatsValeurComponent} from '../../valeurs/details-valeur/achats-valeur/achats-valeur.component';
import {Panel} from 'primeng/panel';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'actions-valeur',
  imports: [
    Popover,
    TranslatePipe,
    AchatsValeurComponent,
    Panel,
    Select,
    FormsModule
  ],
  templateUrl: './actions-valeur.component.html',
  styleUrl: './actions-valeur.component.sass'
})
export class ActionsValeurComponent {
  private popover = viewChild(Popover);

  // paramètres
  cours?: Cours;
  portefeuilleAffiche?: DTOPortefeuille;

  // données pour la vue
  titre?: string;

  // affichage ou pas du panneau des achats
  achatsVisible: boolean = false;

  // pour l'ajout de la valeur dans un portefeuille
  nomsPortefeuillesDisponibles?: Array<string>;
  nomsPortefeuilleSelectionne?: string;

  constructor(private translateService: TranslateService,
              private portefeuillesService: PortefeuillesService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  afficher(event: MouseEvent, cours: Cours, portefeuille: DTOPortefeuille) {
    this.achatsVisible = false;
    this.portefeuilleAffiche = portefeuille;
    this.titre = this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.ACHATS_VALEUR', {'nom': cours.libelle});
    this.nomsPortefeuillesDisponibles = this.portefeuillesService.charger()
      .map(p => p.nom)
      .filter(nom => nom !== portefeuille.nom);
    if (!this.nomsPortefeuilleSelectionne && this.nomsPortefeuillesDisponibles.length > 0) {
      this.nomsPortefeuilleSelectionne = this.nomsPortefeuillesDisponibles[0];
    }
    this.cours = cours;
    this.popover()?.toggle(event);
  }

  suppressionDuPortefeuille(event: Event) {
    if (this.portefeuilleAffiche && this.cours) {
      this.dialogueService.confirmationSuppression(
        this.confirmationService,
        event,
        this.translateService.instant('COMPOSANTS.PORTEFEUILLES.ACTIONS_VALEUR.CONFIRMATION_SUPPRESSION',
          {'valeur': this.cours.libelle, 'nomPortefeuille': this.portefeuilleAffiche.nom}),
        () => {
          this.supprimerDuPortefeuille();
        }
      );
    }
  }

  supprimerDuPortefeuille() {
    if (this.portefeuilleAffiche && this.cours) {
      const portefeuilles = this.portefeuillesService.charger();
      const portefeuille = portefeuilles.find(p => p.nom === this.portefeuilleAffiche!.nom);
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

  ajouterAuPortefeuille() {
    if (this.nomsPortefeuilleSelectionne && this.cours) {
      const portefeuilles = this.portefeuillesService.charger();
      const portefeuilleSelectionne = portefeuilles
        .find(p => p.nom === this.nomsPortefeuilleSelectionne);
      if (portefeuilleSelectionne && !portefeuilleSelectionne.tickers.includes(this.cours.ticker)) {
        portefeuilleSelectionne.tickers.push(this.cours.ticker);
        this.portefeuillesService.enregistrer(portefeuilles);
      }
    }
    this.popover()?.hide();
  }

  deplacerDansPortefeuille() {
    if (this.portefeuilleAffiche && this.nomsPortefeuilleSelectionne && this.cours) {
      const portefeuilles = this.portefeuillesService.charger();
      const portefeuilleSource = portefeuilles
        .find(p => p.nom === this.portefeuilleAffiche!.nom);
      const portefeuilleDestination = portefeuilles
        .find(p => p.nom === this.nomsPortefeuilleSelectionne);
      if (portefeuilleSource && portefeuilleDestination && !portefeuilleDestination.tickers.includes(this.cours.ticker)) {
        portefeuilleSource.tickers.splice(portefeuilleSource.tickers.indexOf(this.cours.ticker), 1);
        portefeuilleDestination.tickers.push(this.cours.ticker);
        this.portefeuillesService.enregistrer(portefeuilles);
      }
    }
    this.popover()?.hide();
  }
}
