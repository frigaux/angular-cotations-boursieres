import {Component, inject, OnInit} from '@angular/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {TableModule} from 'primeng/table';
import {CommonModule} from '@angular/common';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ValeurDecore} from './valeur-decore.class';
import {Marches} from '../../services/valeurs/marches.enum';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {MarcheDecore} from './marche-decore.class';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {LoaderComponent} from '../loader/loader.component';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';

@Component({
  selector: 'app-valeurs',
  imports: [
    TableModule,
    CommonModule,
    TranslatePipe,
    DetailsValeurComponent,
    LoaderComponent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
  ],
  templateUrl: './valeurs.component.html',
  styleUrls: ['../portefeuilles/tabs-panel.sass', './valeurs.component.sass']
})
export class ValeursComponent implements OnInit {
  // chargement des valeurs
  loading: boolean = true;

  // données pour la vue
  marches?: MarcheDecore[];
  idxMarcheCourant: number = NaN;

  // valeur pour laquelle afficher les détails
  valeurSelectionnee: ValeurDecore | undefined = undefined;

  private translateService = inject(TranslateService);

  constructor(private valeursService: ValeursService) {
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.construireVue(valeurs);
      this.idxMarcheCourant = this.marches!.length > 0 ? 0 : NaN;
      this.loading = false;
    });
  }

  construireVue(valeurs: DTOValeur[]): void {
    this.marches = [];
    const valeurByMarche = new Map<Marches, DTOValeur[]>();
    valeurs.forEach(valeur => {
      if (!valeurByMarche.has(valeur.marche)) {
        valeurByMarche.set(valeur.marche, []);
      }
      valeurByMarche.get(valeur.marche)!.push(valeur);
    })
    valeurByMarche.forEach((valeurs, marche) => {
      this.marches!.push(new MarcheDecore(marche, this.translateService, valeurs));
    });
  }

  basculerAffichageValeur(valeur: ValeurDecore) {
    if (this.valeurSelectionnee === undefined || this.valeurSelectionnee.ticker !== valeur.ticker) {
      this.valeurSelectionnee = valeur;
    } else {
      this.valeurSelectionnee = undefined;
    }
  }
}
