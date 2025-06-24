import {Component, OnInit} from '@angular/core';
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
import {ProgressSpinner} from 'primeng/progressspinner';
import {CoursComponent} from './cours/cours.component';
import {ProgressBar} from 'primeng/progressbar';
import {AlertesComponent} from './alertes/alertes.component';

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
    ProgressSpinner,
    CoursComponent,
    ProgressBar,
    AlertesComponent,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrls: ['./accordion-chart.sass', './portefeuilles.component.sass']
})
export class PortefeuillesComponent implements OnInit {
  // chargement des valeurs et cours
  loading: boolean = true;

  // données pour la vue
  date: Date | undefined;
  portefeuillesAvecCours: Array<PortefeuilleAvecCours> = [];
  idxPortefeuilleCourant: number = -1;

  // cours pour lequel afficher les courbes
  coursSelectionne: CoursPortefeuille | undefined = undefined;

  // privé
  private readonly valeurByTicker = new Map<string, DTOValeur>();

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService) {
  }

  ngOnInit(): void {
    this.portefeuillesAvecCours = this.portefeuillesService.charger()
      .filter(portefeuille => portefeuille.tickers.length > 0)
      .map(portefeuille => new PortefeuilleAvecCours(portefeuille));
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      valeurs.forEach(valeur => this.valeurByTicker.set(valeur.ticker, valeur));
      this.idxPortefeuilleCourant = this.portefeuillesAvecCours.findIndex(portefeuilleAvecCours => portefeuilleAvecCours.portefeuille.parDefaut);
      this.chargerPortefeuilleCourant();
    });
  }

  onOpen(e: AccordionTabOpenEvent) {
    this.coursSelectionne = undefined;
    this.idxPortefeuilleCourant = e.index;
    this.chargerPortefeuilleCourant();
  }

  chargerPortefeuilleCourant(): void {
    const portefeuilleAvecCours: PortefeuilleAvecCours = this.portefeuillesAvecCours[this.idxPortefeuilleCourant];
    this.loading = true;
    this.coursService.chargerCoursTickersWithLimit(portefeuilleAvecCours.portefeuille.tickers, 300)
      .subscribe(liste => {
        this.date = liste.length > 0 ? liste[0].date : undefined;
        portefeuilleAvecCours.cours = liste.map(dto => {
          const libelle: string = this.valeurByTicker.get(dto.ticker)!.libelle;
          return new CoursPortefeuille(libelle, dto, portefeuilleAvecCours.alertes);
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

  afficherCours(cours: CoursPortefeuille) {
    this.coursSelectionne = cours;
  }
}
