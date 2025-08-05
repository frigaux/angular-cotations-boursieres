import {Component, OnInit, viewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgIf, PercentPipe} from '@angular/common';
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
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {ActionsValeurComponent} from './actions-valeur/actions-valeur.component';
import {Cours} from '../cours/cours.class';
import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';

@Component({
  selector: 'app-portefeuilles',
  imports: [
    NgIf,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    TableModule,
    TranslatePipe,
    PercentPipe,
    DatePipe,
    DetailsValeurComponent,
    AlertesComponent,
    NgClass,
    CurrencyPipe,
    Skeleton,
    LoaderComponent,
    ActionsValeurComponent
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrls: ['./accordion-chart.sass', './portefeuilles.component.sass']
})
export class PortefeuillesComponent implements OnInit {
  private actionsValeur = viewChild(ActionsValeurComponent);

  // chargement des valeurs et cours
  loading: boolean = true;

  // données pour la vue
  date?: string;
  portefeuillesAvecCours: Array<PortefeuilleAvecCours> = [];
  idxPortefeuilleCourant: number = -1;

  // cours pour lequel afficher les courbes
  coursSelectionne: CoursPortefeuille | undefined = undefined;

  // privé
  private readonly valeurByTicker = new Map<string, DTOValeur>();

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService) {
    portefeuillesService.onUpdate(portefeuilles => this.chargerPortefeuilleCourant());
    valeursService.onImportAchats(achatsTickers => this.chargerPortefeuilleCourant());
    valeursService.onUpdateAchats(achatsTickers => this.chargerPortefeuilleCourant());
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      valeurs.forEach(valeur => this.valeurByTicker.set(valeur.ticker, valeur));
      this.idxPortefeuilleCourant = this.portefeuillesService.charger()
        .filter(portefeuille => portefeuille.tickers.length > 0)
        .findIndex(portefeuille => portefeuille.parDefaut);
      if (this.idxPortefeuilleCourant === -1) {
        this.idxPortefeuilleCourant = 0;
      }
      this.chargerPortefeuilleCourant();
    });
  }

  onOpenAccordion(e: AccordionTabOpenEvent) {
    this.coursSelectionne = undefined;
    this.idxPortefeuilleCourant = e.index;
    this.chargerPortefeuilleCourant();
  }

  chargerPortefeuilleCourant(): void {
    this.portefeuillesAvecCours = this.portefeuillesService.charger()
      .filter(portefeuille => portefeuille.tickers.length > 0)
      .map(portefeuille => new PortefeuilleAvecCours(portefeuille));
    const portefeuilleAvecCours: PortefeuilleAvecCours = this.portefeuillesAvecCours[this.idxPortefeuilleCourant];
    this.loading = true;
    this.coursService.chargerCoursTickersWithLimit(portefeuilleAvecCours.portefeuille.tickers, 300)
      .subscribe(liste => {
        this.date = liste.length > 0 ? liste[0].date : undefined;
        const achatsByTicker = this.valeursService.chargerAchatsByTicker();
        portefeuilleAvecCours.cours = liste.map(dto => {
          return new CoursPortefeuille(this.valeurByTicker.get(dto.ticker)!, dto, portefeuilleAvecCours.alertes, this.calculerVariationAchats(dto, achatsByTicker));
        });
        this.loading = false;
      })
  }

  classeIconeVariation(variation: number): string {
    if (variation == 0) {
      return 'pi-arrow-circle-right';
    } else if (variation > 0) {
      return 'pi-arrow-circle-up';
    } else {
      return 'pi-arrow-circle-down';
    }
  }

  classeCssVariation(variation: number): string {
    return variation >= 0 ? 'positive' : 'negative';
  }

  classeCssMM(cours: CoursPortefeuille, mm: number) {
    return cours.cloture >= mm ? 'positive' : 'negative';
  }

  basculerAffichageCours(cours: CoursPortefeuille) {
    if (this.coursSelectionne === undefined || this.coursSelectionne.ticker !== cours.ticker) {
      this.coursSelectionne = cours;
    } else {
      this.coursSelectionne = undefined;
    }
  }

  // TODO : à supprimer avec tableau configurable
  calculerVariationAchats(dto: DTOCoursAvecListeAllege, achatsByTicker: Map<string, DTOAchat[]>): number | undefined {
    const achats: Array<DTOAchat> = (achatsByTicker.get(dto.ticker) || [])
      .filter(achat => !achat.revendu);
    if (achats.length === 0) {
      return undefined;
    }
    if (achats.length === 1) {
      return (dto.cloture / achats[0].prix) - 1;
    }
    let totalQuantites = 0;
    let totalPrix = 0;
    for (const achat of achats) {
      totalQuantites += achat.quantite;
      totalPrix += achat.prix * achat.quantite;
    }
    return (dto.cloture / (totalPrix / totalQuantites)) - 1;
  }

  afficherActions(event: MouseEvent, cours: Cours, portefeuille: DTOPortefeuille) {
    this.actionsValeur()?.afficher(event, cours, portefeuille);
  }
}
