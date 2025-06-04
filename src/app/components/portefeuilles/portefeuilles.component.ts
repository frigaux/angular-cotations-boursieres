import {Component, OnInit} from '@angular/core';
import {DatePipe, DecimalPipe, NgClass, NgIf, PercentPipe} from '@angular/common';
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

@Component({
  selector: 'app-portefeuilles',
  imports: [
    NgIf,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    TableModule,
    DecimalPipe,
    TranslatePipe,
    PercentPipe,
    NgClass,
    DatePipe,
    ProgressSpinner,
    CoursComponent
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrl: './portefeuilles.component.sass'
})
export class PortefeuillesComponent implements OnInit {
  // chargement des valeurs et cours
  loading: boolean = true;

  // données pour la vue
  date: Date | undefined;
  portefeuillesAvecCours: Array<PortefeuilleAvecCours> = [];
  currencyFormatter: Intl.NumberFormat;

  // cours pour lequel afficher les courbes
  coursSelectionne: CoursPortefeuille | undefined = undefined;

  // privé
  private readonly valeurByTicker = new Map<string, DTOValeur>();

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService) {
    this.currencyFormatter = new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'});
  }

  ngOnInit(): void {
    this.portefeuillesAvecCours = this.portefeuillesService.charger()
      .map(portefeuille => new PortefeuilleAvecCours(portefeuille));
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      valeurs.forEach(valeur => this.valeurByTicker.set(valeur.ticker, valeur));
      if (this.portefeuillesAvecCours.length === 1) {
        this.chargerCours(this.portefeuillesAvecCours[0]);
      } else {
        this.loading = false;
      }
    });
  }

  onOpen(e: AccordionTabOpenEvent) {
    this.chargerCours(this.portefeuillesAvecCours[e.index]);
  }

  chargerCours(portefeuilleAvecCours: PortefeuilleAvecCours): void {
    this.loading = true;
    this.coursService.chargerCoursTickersWithLimit(portefeuilleAvecCours.portefeuille.tickers, 300)
      .subscribe(liste => {
        this.date = liste.length > 0 ? liste[0].date : undefined;
        portefeuilleAvecCours.cours = liste.map(dto => {
          const libelle: string = this.valeurByTicker.get(dto.ticker)!.libelle;
          return new CoursPortefeuille(libelle, dto);
        });
        this.loading = false;
      })
  }

  classeVariation(variation: number): string {
    return variation >= 0 ? 'positive' : 'negative';
  }

  classeMM(cours: CoursPortefeuille, mm: number) {
    return cours.cloture >= mm ? 'positive' : 'negative';
  }
}
