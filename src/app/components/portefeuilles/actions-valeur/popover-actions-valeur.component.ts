import {Component, viewChild} from '@angular/core';
import {Popover} from "primeng/popover";
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {PanneauAchatsValeurComponent} from './panneau-achats-valeur/panneau-achats-valeur.component';
import {DialogCotationsTickerComponent} from './dialog-cotations-ticker/dialog-cotations-ticker.component';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {PortefeuilleAvecCours} from '../portefeuille-avec-cours.class';
import {
  DialogCotationsTickersPortefeuilleComponent
} from './dialog-cotations-tickers-portefeuille/dialog-cotations-tickers-portefeuille.component';

@Component({
  selector: 'app-popover-actions-valeur',
  imports: [
    Popover,
    TranslatePipe,
    Select,
    FormsModule,
    PanneauAchatsValeurComponent,
    DialogCotationsTickerComponent,
    DialogCotationsTickersPortefeuilleComponent
  ],
  templateUrl: './popover-actions-valeur.component.html',
  styleUrl: './popover-actions-valeur.component.sass'
})
export class PopoverActionsValeurComponent {
  private popover = viewChild(Popover);
  private dialogCoursTickerComponent = viewChild(DialogCotationsTickerComponent);
  private dialogCotationsTickersPortefeuilleComponent = viewChild(DialogCotationsTickersPortefeuilleComponent);

  // paramètres
  cours?: CoursPortefeuille;
  portefeuilleAvecCoursAffiche?: PortefeuilleAvecCours;
  portefeuilleAffiche?: DTOPortefeuille;

  // affichage ou pas du panneau des achats
  achatsVisible: boolean = false;

  // pour l'ajout de la valeur dans un portefeuille
  nomsPortefeuillesDisponibles?: Array<string>;
  nomsPortefeuilleSelectionne?: string;

  // le portefeuille achats n'existe pas et certaines actions ne sont donc pas disponibles
  portefeuilleAchats?: boolean;

  constructor(private translateService: TranslateService,
              private portefeuillesService: PortefeuillesService,
              private confirmationService: ConfirmationService,
              private dialogueService: DialogueService) {
  }

  afficher(event: MouseEvent, cours: CoursPortefeuille, portefeuilleAvecCours: PortefeuilleAvecCours) {
    this.achatsVisible = false;
    this.cours = cours;
    this.portefeuilleAvecCoursAffiche = portefeuilleAvecCours;
    this.portefeuilleAffiche = portefeuilleAvecCours.portefeuille;
    this.nomsPortefeuillesDisponibles = this.portefeuillesService.charger()
      .map(p => p.nom)
      .filter(nom => nom !== this.portefeuilleAffiche!.nom);
    if (!this.nomsPortefeuilleSelectionne && this.nomsPortefeuillesDisponibles.length > 0) {
      this.nomsPortefeuilleSelectionne = this.nomsPortefeuillesDisponibles[0];
    }
    this.portefeuilleAchats = this.portefeuilleAffiche.nom === PortefeuillesService.PORTEFEUILLE_ACHATS;
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

  protected boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cours!.ticker}/`);
    this.popover()?.hide();
  }

  protected abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cours!.ticker}p`);
    this.popover()?.hide();
  }

  protected coursBoursorama() {
    this.dialogCoursTickerComponent()?.afficherCours(this.cours!);
    this.popover()?.hide();
  }

  protected coursBoursoramaPortefeuille() {
    this.dialogCotationsTickersPortefeuilleComponent()?.afficherPortefeuille(this.portefeuilleAvecCoursAffiche!);
    this.popover()?.hide();
  }
}
