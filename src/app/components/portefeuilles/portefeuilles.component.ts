import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {ProgressBar} from 'primeng/progressbar';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel, AccordionTabOpenEvent} from 'primeng/accordion';
import {TableModule} from 'primeng/table';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {PortefeuilleAvecCours} from './portefeuille-avec-cours.class';

@Component({
  selector: 'app-portefeuilles',
  imports: [
    NgIf,
    ProgressBar,
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionPanel,
    TableModule
  ],
  templateUrl: './portefeuilles.component.html',
  styleUrl: './portefeuilles.component.sass'
})
export class PortefeuillesComponent implements OnInit {
  // chargement des valeurs et cours
  loading: boolean = true;

  // données pour la vue
  portefeuillesAvecCours: Array<PortefeuilleAvecCours> = [];

  //
  readonly valeurByTicker = new Map<string, DTOValeur>();

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService) {
  }

  ngOnInit(): void {
    this.portefeuillesAvecCours = this.portefeuillesService.charger()
      .map(portefeuille => new PortefeuilleAvecCours(portefeuille));
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      valeurs.forEach(valeur => this.valeurByTicker.set(valeur.ticker, valeur));
      if (this.portefeuillesAvecCours.length === 1) {
        this.chargerCours(this.portefeuillesAvecCours[0]);
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
        // TODO
        this.loading = false;
      })
  }
}
