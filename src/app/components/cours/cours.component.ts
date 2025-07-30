import {Component, inject, OnInit, viewChild} from '@angular/core';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {CoursMarche} from './cours-marche.class';
import {Marches} from '../../services/valeurs/marches.enum';
import {DTOListeCours} from '../../services/cours/dto-liste-cours.interface';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Cours} from './cours.class';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {CurrencyPipe, DatePipe, NgClass, NgIf, PercentPipe} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {LoaderComponent} from '../loader/loader.component';
import {CoursPortefeuille} from '../portefeuilles/cours-portefeuille.class';
import {AjoutAuPortefeuilleComponent} from './ajout-au-portefeuille/ajout-au-portefeuille.component';

// TODO : gérer des filtres sur les MM des cours
@Component({
  selector: 'app-cours',
  imports: [
    TableModule,
    TranslatePipe,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    DetailsValeurComponent,
    DatePipe,
    NgIf,
    NgClass,
    CurrencyPipe,
    Skeleton,
    LoaderComponent,
    PercentPipe,
    AjoutAuPortefeuilleComponent
  ],
  templateUrl: './cours.component.html',
  styleUrls: ['../portefeuilles/accordion-chart.sass', './cours.component.sass']
})
export class CoursComponent implements OnInit {
  private ajoutAuPortefeuille = viewChild(AjoutAuPortefeuilleComponent);

  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  date!: string;
  marches: CoursMarche[] = [];

  // cours pour lequel afficher les moyennes mobiles
  coursSelectionne: Cours | undefined = undefined;

  // services
  private translateService = inject(TranslateService);

  constructor(private valeursService: ValeursService,
              private coursService: CoursService) {
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.chargerCours(valeurs);
    });
  }

  chargerCours(valeurs: DTOValeur[]): void {
    const valeurByTicker = new Map<string, DTOValeur>();
    valeurs.forEach(valeur => valeurByTicker.set(valeur.ticker, valeur));

    this.coursService.chargerCours().subscribe(liste => {
      this.mapCours(liste, valeurByTicker);
      this.loading = false;
    })
  }

  private mapCours(liste: DTOListeCours, valeurByTicker: Map<string, DTOValeur>) {
    this.date = liste.date;
    const coursByMarche = new Map<Marches, Cours[]>();

    liste.cours.map(dto => {
      const valeur = valeurByTicker.get(dto.ticker);
      return Cours.fromDTOCours(liste.date, valeur!.libelle, dto)
    }).forEach(cours => {
      const marche = valeurByTicker.get(cours.ticker)!.marche;
      if (!coursByMarche.has(marche)) {
        coursByMarche.set(marche, []);
      }
      coursByMarche.get(marche)!.push(cours);
    });
    coursByMarche.forEach((cours, marche) => {
      this.marches.push(new CoursMarche(marche, this.translateService, cours));
    });
  }

  basculerAffichageCours(cours: Cours) {
    if (this.coursSelectionne === undefined || this.coursSelectionne.ticker !== cours.ticker) {
      this.coursSelectionne = cours;
    } else {
      this.coursSelectionne = undefined;
    }
  }

  classeCssVariation(variation: number): string {
    return variation >= 0 ? 'positive' : 'negative';
  }

  classeCssMM(cours: CoursPortefeuille, mm: number) {
    return cours.cloture >= mm ? 'positive' : 'negative';
  }

  afficherAjoutAuPortefeuille(event: MouseEvent, cours: Cours) {
    this.ajoutAuPortefeuille()?.afficher(event, cours.ticker);
  }
}
