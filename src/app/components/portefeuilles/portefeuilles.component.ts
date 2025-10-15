import {Component, OnInit, viewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgStyle, PercentPipe} from '@angular/common';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel, AccordionTabOpenEvent} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {PortefeuilleAvecCours} from './portefeuille-avec-cours.class';
import {CoursPortefeuille} from './cours-portefeuille.class';
import {TranslatePipe} from '@ngx-translate/core';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {AlertesComponent} from './alertes/alertes.component';
import {Skeleton} from 'primeng/skeleton';
import {LoaderComponent} from '../loader/loader.component';
import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {ActionsValeurComponent} from './actions-valeur/actions-valeur.component';
import {Cours} from '../cours/cours.class';
import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOColonne} from '../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../services/tableaux/types-colonnes-portefeuille.enum';
import {ColonneDecoree} from './colonne-decoree.class';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActualitesComponent} from '../cours/actualites/actualites.component';

// TODO : créer dynamiquement le portefeuille des achats
@Component({
  selector: 'app-portefeuilles',
  imports: [
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    TableModule,
    TranslatePipe,
    DatePipe,
    DetailsValeurComponent,
    AlertesComponent,
    NgClass,
    Skeleton,
    LoaderComponent,
    ActionsValeurComponent,
    NgStyle,
    CurrencyPipe,
    PercentPipe,
    DecimalPipe,
    ActualitesComponent
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrls: ['./accordion-chart.sass', './portefeuilles.component.sass']
})
export class PortefeuillesComponent implements OnInit {
  private actionsValeur = viewChild(ActionsValeurComponent);

  // chargement des valeurs et cours
  loading: boolean = true;

  // les colonnes dynamiques de la table
  protected colonnesDecorees?: ColonneDecoree[];
  protected idColonneTriParDefaut?: number;
  protected readonly TypesColonnesPortefeuille = TypesColonnesPortefeuille;

  // données pour la vue
  protected date?: string;
  portefeuillesAvecCours: Array<PortefeuilleAvecCours> = [];
  protected idxPortefeuilleCourant: number = -1;
  protected scrollHeight: string = 'calc(100vh - 14rem)';

  // cours pour lequel afficher les courbes
  coursSelectionne: CoursPortefeuille | undefined = undefined;

  // privé
  private listeCours?: DTOCoursAvecListeAllege[];
  private readonly valeurByTicker = new Map<string, DTOValeur>();

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService,
              private tableauxService: TableauxService,
              private breakpointObserver: BreakpointObserver) {
    portefeuillesService.onUpdate(portefeuilles => this.chargerPortefeuilleCourant());
    valeursService.onImportAchats(achatsTickers => this.afficherPortefeuilleCourant());
    valeursService.onUpdateAchats(achatsTickers => this.afficherPortefeuilleCourant());
    // cet observable émet immédiatement une correspondance !
    breakpointObserver.observe([
      '(orientation: portrait)',
      '(orientation: landscape)',
    ]).subscribe(matches => this.afficherPortefeuilleCourant());
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      valeurs.forEach(valeur => this.valeurByTicker.set(valeur.ticker, valeur));
      this.idxPortefeuilleCourant = this.portefeuillesService.indexPortefeuilleParDefaut();
      this.chargerPortefeuilleCourant();
    });
  }

  onOpenAccordion(e: AccordionTabOpenEvent) {
    this.coursSelectionne = undefined;
    this.chargerPortefeuilleCourant();
  }

  chargerPortefeuilleCourant(): void {
    this.portefeuillesAvecCours = this.portefeuillesService.charger()
      .filter(portefeuille => portefeuille.tickers.length > 0)
      .map(portefeuille => new PortefeuilleAvecCours(portefeuille));
    this.scrollHeight = `calc(100vh - ${14 + 4 * this.portefeuillesAvecCours.length}rem)`;
    const portefeuilleAvecCours: PortefeuilleAvecCours = this.portefeuillesAvecCours[this.idxPortefeuilleCourant];
    this.loading = true;
    this.coursService.chargerCoursTickersWithLimit(portefeuilleAvecCours.portefeuille.tickers, 300)
      .subscribe(liste => {
        this.listeCours = liste;
        this.afficherPortefeuilleCourant();
        this.loading = false;
      });
  }

  afficherPortefeuilleCourant(): void {
    if (this.listeCours) {
      this.date = this.listeCours.length > 0 ? this.listeCours[0].date : undefined;

      this.colonnesDecorees = this.decorerColonnes();
      this.idColonneTriParDefaut = this.colonnesDecorees.find(colonneDecoree => colonneDecoree.colonne.tri)?.id;

      const portefeuilleAvecCours: PortefeuilleAvecCours = this.portefeuillesAvecCours[this.idxPortefeuilleCourant];
      portefeuilleAvecCours.cours = this.listeCours.map(dto => {
        return new CoursPortefeuille(this.valeurByTicker.get(dto.ticker)!, dto,
          portefeuilleAvecCours.alertes, this.colonnesDecorees!);
      });
    }
  }

  private decorerColonnes() {
    const tableau = this.tableauxService.charger().portefeuille;
    const isPaysage = this.breakpointObserver.isMatched('(orientation: landscape)');
    const colonnes: DTOColonne<TypesColonnesPortefeuille>[] = isPaysage ? tableau.colonnesPaysage : tableau.colonnesPortrait;
    let i = 0;
    return colonnes.map(colonne =>
      new ColonneDecoree(i++, colonne, this.tableauxService.valeurPourUnCours(colonne))
    );
  }

  protected iconeVariation(variation: number): string {
    if (variation == 0) {
      return 'pi-arrow-circle-right';
    } else if (variation > 0) {
      return 'pi-arrow-circle-up';
    } else {
      return 'pi-arrow-circle-down';
    }
  }

  protected evolutionColonne(colonneDecoree: ColonneDecoree, cours: CoursPortefeuille): string {
    if (colonneDecoree.colonne.type === TypesColonnesPortefeuille.COURS
      || colonneDecoree.colonne.type === TypesColonnesPortefeuille.MOYENNE_MOBILE) {
      return cours.cloture >= colonneDecoree.evaluer(cours) ? 'positive' : 'negative';
    }
    if (colonneDecoree.colonne.type === TypesColonnesPortefeuille.VARIATION_ACHATS
      || colonneDecoree.colonne.type === TypesColonnesPortefeuille.VARIATION) {
      return colonneDecoree.evaluer(cours) >= 0 ? 'positive' : 'negative';
    }
    return '';
  }

  basculerAffichageCours(cours: CoursPortefeuille) {
    if (this.coursSelectionne === undefined || this.coursSelectionne.ticker !== cours.ticker) {
      this.coursSelectionne = cours;
    } else {
      this.coursSelectionne = undefined;
    }
  }

  private afficherActions(event: MouseEvent, cours: Cours, portefeuille: DTOPortefeuille) {
    this.actionsValeur()?.afficher(event, cours, portefeuille);
  }

  protected onClickCours(event: MouseEvent, cours: any, portefeuille: DTOPortefeuille) {
    if (event.target instanceof Element && event.target.tagName === 'SPAN') {
      this.afficherActions(event, cours, portefeuille);
    } else {
      this.basculerAffichageCours(cours);
    }
  }
}
