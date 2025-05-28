import {Component, inject, OnInit} from '@angular/core';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {CoursMarche} from './cours-marche.class';
import {Marche} from '../../services/valeurs/marche.enum';
import {DTOListeCours} from '../../services/cours/dto-liste-cours.interface';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Cours} from './cours.class';
import {ValeurComponent} from './valeur/valeur.component';

@Component({
  selector: 'app-cours',
  imports: [TableModule, CommonModule, TranslatePipe, Accordion, AccordionPanel, AccordionHeader, AccordionContent, ProgressSpinner, ValeurComponent],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.sass'
})
export class CoursComponent implements OnInit {
  // chargement des cours
  loading: boolean = true;
  // données pour la vue
  date!: Date;
  marches: CoursMarche[] = [];
  // cours pour lequel afficher les moyennes mobiles
  coursSelectionne : Cours | undefined = undefined;

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
    const coursByMarche = new Map<Marche, Cours[]>();

    liste.cours.map(dto => {
      const valeur = valeurByTicker.get(dto.ticker);
      return new Cours(liste.date, valeur!.ticker, valeur!.libelle, dto);
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

  protected readonly Date = Date;
}
