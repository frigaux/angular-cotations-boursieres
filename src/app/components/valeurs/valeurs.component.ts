import {Component, inject, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Valeur} from './Valeur';
import {Marche} from '../../services/valeurs/marche';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ValeurComponent} from './valeur/valeur.component';
import {ValeurMarche} from './ValeurMarche';
import {DTOValeur} from '../../services/valeurs/DTOValeur';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';

@Component({
  selector: 'app-valeurs',
  imports: [TableModule, CommonModule, TranslatePipe, ScrollPanelModule, ValeurComponent, Accordion, AccordionContent, AccordionHeader, AccordionPanel],
  templateUrl: './valeurs.component.html',
  styleUrl: './valeurs.component.sass'
})
export class ValeursComponent implements OnInit {
  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  marches: ValeurMarche[] = [];

  // valeur pour laquelle afficher les détails
  valeurSelectionnee: Valeur | undefined = undefined;

  private translateService = inject(TranslateService);

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.mapValeurs(valeurs);
      this.loading = false;
    });
  }

  mapValeurs(valeurs: DTOValeur[]): void {
    const valeurByMarche = new Map<Marche, DTOValeur[]>();
    valeurs.forEach(valeur => {
      if (!valeurByMarche.has(valeur.marche)) {
        valeurByMarche.set(valeur.marche, []);
      }
      valeurByMarche.get(valeur.marche)!.push(valeur);
    })
    valeurByMarche.forEach((valeurs, marche) => {
      this.marches.push(new ValeurMarche(marche, this.translateService, valeurs));
    });
  }
}
