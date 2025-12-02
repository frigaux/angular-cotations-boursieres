import {Component, OnInit, viewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgStyle, PercentPipe} from '@angular/common';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {TableModule} from 'primeng/table';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {PortefeuilleAvecCours} from './portefeuille-avec-cours.class';
import {CoursPortefeuille} from './cours-portefeuille.class';
import {TranslatePipe} from '@ngx-translate/core';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {ColonneAlertesComponent} from './colonnes/alertes/colonne-alertes.component';
import {Skeleton} from 'primeng/skeleton';
import {LoaderComponent} from '../loader/loader.component';
import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {PopoverActionsValeurComponent} from './popover-actions-valeur/popover-actions-valeur.component';
import {TableauxService} from '../../services/tableaux/tableaux.service';
import {DTOColonne} from '../../services/tableaux/dto-colonne-portefeuille.interface';
import {TypesColonnesPortefeuille} from '../../services/tableaux/types-colonnes-portefeuille.enum';
import {ColonneDecoree} from './colonne-decoree.class';
import {BreakpointObserver} from '@angular/cdk/layout';
import {DialogActualitesComponent} from '../cours/dialog-actualites/dialog-actualites.component';
import {
  DialogEvaluationActualitesComponent
} from '../cours/dialog-evaluation-actualites/dialog-evaluation-actualites.component';
import {ColonneDividendesComponent} from './colonnes/dividendes/colonne-dividendes.component';
import {
  SauvegardeRestaurationComponent
} from '../parametrage/sauvegarde-restauration/sauvegarde-restauration.component';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';
import {IconeVariation} from '../../directives/icone-variation';
import {EtapeValeurUtil} from '../valeurs/achats-valeur/etape-valeur-util.class';

@Component({
  selector: 'app-portefeuilles',
  imports: [
    TableModule,
    TranslatePipe,
    DatePipe,
    DetailsValeurComponent,
    ColonneAlertesComponent,
    NgClass,
    Skeleton,
    LoaderComponent,
    PopoverActionsValeurComponent,
    NgStyle,
    CurrencyPipe,
    PercentPipe,
    DecimalPipe,
    DialogActualitesComponent,
    DialogEvaluationActualitesComponent,
    ColonneDividendesComponent,
    SauvegardeRestaurationComponent,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    IconeVariation
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrls: ['./tabs-panel.sass', './portefeuilles.component.sass', '../commun/titre.sass']
})
export class PortefeuillesComponent implements OnInit {
  private actionsValeur = viewChild(PopoverActionsValeurComponent);

  // chargement des valeurs et cours
  loading: boolean = true;

  // les colonnes dynamiques de la table
  protected colonnesDecorees?: ColonneDecoree[];
  protected idColonneTriParDefaut?: number;
  protected readonly TypesColonnesPortefeuille = TypesColonnesPortefeuille;

  // données pour la vue
  protected date?: string;
  portefeuillesAvecCours: Array<PortefeuilleAvecCours> = [];
  idxPortefeuilleCourant: number = -1;

  // cours pour lequel afficher les courbes
  coursSelectionne: CoursPortefeuille | undefined = undefined;

  // privé
  private listeCours?: DTOCoursAvecListeAllege[];
  protected valeurByTicker?: Map<string, DTOValeur>;

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService,
              private tableauxService: TableauxService,
              private dividendesService: DividendesService,
              private breakpointObserver: BreakpointObserver) {
    // restauration des paramètres ou modification des valeurs d'un portefeuille ou des achats de valeur
    portefeuillesService.onUpdate(portefeuilles => this.chargerPortefeuilleCourant());
    valeursService.onUpdateAchats(achatsTickers => this.chargerPortefeuilleCourant());
    tableauxService.onUpdate(tableaux => this.definirCoursPortefeuilleCourant());
    dividendesService.onUpdate(dividendes => this.definirCoursPortefeuilleCourant());

    // cet observable émet initialement une correspondance !
    breakpointObserver.observe([
      '(orientation: portrait)',
      '(orientation: landscape)',
    ]).subscribe(matches => this.definirCoursPortefeuilleCourant());
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.determinerIdxPortefeuilleCourant();
      this.chargerPortefeuilleCourant();
    });
  }

  private determinerIdxPortefeuilleCourant() {
    if (this.tickersEnPortefeuilleAchats().length > 0) {
      this.idxPortefeuilleCourant = this.portefeuillesService.charger()
        .filter(portefeuille => portefeuille.tickers.length > 0)
        .length;
    } else {
      this.idxPortefeuilleCourant = this.indexPortefeuilleCourant();
    }
  }

  private indexPortefeuilleCourant(): number {
    const idxPortefeuilleCourant = this.portefeuillesService.charger()
      .filter(portefeuille => portefeuille.tickers.length > 0)
      .findIndex(portefeuille => portefeuille.parDefaut);
    return idxPortefeuilleCourant !== -1 ? idxPortefeuilleCourant : 0;
  }

  protected onClickTab() {
    this.coursSelectionne = undefined;
    this.chargerPortefeuilleCourant();
  }

  private chargerPortefeuilleCourant(): void {
    this.portefeuillesAvecCours = this.chargerPortefeuilles();
    const portefeuilleAvecCours: PortefeuilleAvecCours = this.portefeuillesAvecCours[this.idxPortefeuilleCourant];
    this.loading = true;
    this.coursService.chargerCoursTickersWithLimit(portefeuilleAvecCours.portefeuille.tickers, 300)
      .subscribe(liste => {
        this.listeCours = liste;
        this.definirCoursPortefeuilleCourant();
        this.loading = false;
      });
  }

  private chargerPortefeuilles() {
    const portefeuilles = this.portefeuillesService.charger();
    // ajout éventuel du portefeuille des achats
    const tickersNonRevendus = this.tickersEnPortefeuilleAchats();
    if (tickersNonRevendus.length > 0) {
      portefeuilles.push({
        nom: PortefeuillesService.PORTEFEUILLE_ACHATS,
        parDefaut: false,
        tickers: tickersNonRevendus,
        alertes: PortefeuillesService.CONFIGURATION_INITIALE[0].alertes,
      });
    }
    return portefeuilles.filter(portefeuille => portefeuille.tickers.length > 0)
      .map(portefeuille => new PortefeuilleAvecCours(portefeuille));
  }

  private tickersEnPortefeuilleAchats() {
    return this.valeursService.chargerAchats()
      .filter(achats => achats.achats.find(achat => EtapeValeurUtil.isAchat(achat)) !== undefined)
      .map(achats => achats.ticker);
  }

  private definirCoursPortefeuilleCourant(): void {
    if (this.listeCours) {
      this.date = this.listeCours.length > 0 ? this.listeCours[0].date : undefined;

      this.colonnesDecorees = this.decorerColonnes();
      this.idColonneTriParDefaut = this.colonnesDecorees.find(colonneDecoree => colonneDecoree.colonne.tri)?.id;

      const portefeuilleAvecCours: PortefeuilleAvecCours = this.portefeuillesAvecCours[this.idxPortefeuilleCourant];
      portefeuilleAvecCours.cours = this.listeCours.map(dto => {
        return new CoursPortefeuille(this.valeurByTicker!.get(dto.ticker)!, dto,
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

  _basculerAffichageCours(cours: CoursPortefeuille) {
    if (this.coursSelectionne === undefined || this.coursSelectionne.ticker !== cours.ticker) {
      this.coursSelectionne = cours;
    } else {
      this.coursSelectionne = undefined;
    }
  }

  private afficherActions(event: MouseEvent, cours: CoursPortefeuille, portefeuilleAvecCours: PortefeuilleAvecCours) {
    this.actionsValeur()?.afficher(event, cours, portefeuilleAvecCours);
  }

  protected onClickCours(event: MouseEvent, cours: CoursPortefeuille, portefeuilleAvecCours: PortefeuilleAvecCours) {
    if (event.target instanceof Element && event.target.tagName === 'SPAN' && event.target.className.indexOf('pi') !== -1) {
      this.afficherActions(event, cours, portefeuilleAvecCours);
    } else {
      this._basculerAffichageCours(cours);
    }
  }
}
