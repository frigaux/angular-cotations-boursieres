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
import {CurrencyPipe, DatePipe, NgClass, PercentPipe} from '@angular/common';
import {Skeleton} from 'primeng/skeleton';
import {LoaderComponent} from '../loader/loader.component';
import {PopoverActionsValeurComponent} from './actions-valeur/popover-actions-valeur.component';
import {SortEvent} from 'primeng/api';
import {SelecteurFiltreComponent} from './selecteur-filtre/selecteur-filtre.component';
import {FiltreDecore} from './selecteur-filtre/filtre-decore.class';
import {DialogImportExportComponent} from './dialog-editeur-filtres/import-export/dialog-import-export.component';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {DialogActualitesComponent} from './dialog-actualites/dialog-actualites.component';
import {VueUtil} from '../commun/vue-util.class';

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
    NgClass,
    CurrencyPipe,
    Skeleton,
    LoaderComponent,
    PercentPipe,
    PopoverActionsValeurComponent,
    SelecteurFiltreComponent,
    DialogImportExportComponent,
    DialogActualitesComponent
  ],
  templateUrl: './cours.component.html',
  styleUrls: ['../portefeuilles/accordion-chart.sass', './cours.component.sass', '../commun/titre.sass']
})
export class CoursComponent implements OnInit {
  private ajoutAuPortefeuille = viewChild(PopoverActionsValeurComponent);

  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  date?: string;
  marches?: CoursMarche[];
  idxMarcheCourant: number = -1;
  protected readonly VueUtil = VueUtil;

  // cours pour lequel afficher les moyennes mobiles
  coursSelectionne: Cours | undefined = undefined;

  // private
  private translateService = inject(TranslateService);
  private valeurByTicker?: Map<string, DTOValeur>;
  private liste?: DTOListeCours;
  private filtreActif?: FiltreDecore;
  private portefeuilles: boolean;

  constructor(private valeursService: ValeursService,
              private coursService: CoursService,
              private portefeuillesService: PortefeuillesService) {
    this.portefeuilles = this.portefeuillesService.auMoinsUnPortefeuilleCorrectementConfigure();
  }

  ngOnInit(): void {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.chargerCours(valeurs);
    });
  }

  chargerCours(valeurs: DTOValeur[]): void {
    this.valeurByTicker = new Map<string, DTOValeur>();
    for (const valeur of valeurs) {
      this.valeurByTicker.set(valeur.ticker, valeur);
    }

    this.coursService.chargerCours().subscribe(liste => {
      this.liste = liste;
      this.decorerCours();
      this.loading = false;
    })
  }

  private decorerCours() {
    this.marches = [];

    if (this.liste && this.valeurByTicker) {
      this.date = this.liste.date;
      const coursByMarche = new Map<Marches, Cours[]>();

      this.liste.cours
        .filter(c => {
          return !this.filtreActif || this.filtreActif.evaluer(c.moyennesMobiles);
        })
        .map(dto => {
          const valeur = this.valeurByTicker!.get(dto.ticker);
          return Cours.fromDTOCours(this.liste!.date, valeur!.libelle, dto)
        })
        .forEach(cours => {
          const marche = this.valeurByTicker!.get(cours.ticker)!.marche;
          if (!coursByMarche.has(marche)) {
            coursByMarche.set(marche, []);
          }
          coursByMarche.get(marche)!.push(cours);
        });

      coursByMarche.forEach((cours, marche) => {
        this.marches!.push(new CoursMarche(marche, this.translateService, cours));
      });
    }
  }

  onClickCours(event: MouseEvent, cours: Cours) {
    if (event.target instanceof Element && event.target.tagName === 'SPAN' && this.portefeuilles) {
      this.afficherAjoutAuPortefeuille(event, cours);
    } else {
      this.basculerAffichageCours(cours);
    }
  }

  private basculerAffichageCours(cours: Cours) {
    if (this.coursSelectionne === undefined || this.coursSelectionne.ticker !== cours.ticker) {
      this.coursSelectionne = cours;
    } else {
      this.coursSelectionne = undefined;
    }
  }

  private afficherAjoutAuPortefeuille(event: MouseEvent, cours: Cours) {
    this.ajoutAuPortefeuille()?.afficher(event, cours.ticker);
  }

  evolutionCours(cloture: number, cours: number) {
    return cloture >= cours ? 'positive' : 'negative';
  }

  // on procède à un tri "manuel" des données affichées dans le p-table
  // en tri automatique les données ne sont pas mises à jour par p-table :/
  trierColonne(event: SortEvent, marche: CoursMarche) {
    marche.cours.sort((c1, c2) => {
      switch (event.field) {
        case 'libelle' :
          return event.order! * c1.libelle.localeCompare(c2.libelle);
        case 'cloture' :
          return event.order! * (c1.cloture - c2.cloture);
        case 'var1' :
          return c1.var1 !== undefined && c2.var1 !== undefined ? event.order! * (c1.var1 - c2.var1) : 0;
        default:
          return 0;
      }
    });
  }

  private marcheSelectionne() {
    return this.marches!.find(marche => marche.cours.indexOf(this.coursSelectionne!) !== -1);
  }

  valeurPrecedente() {
    const marcheSelectionne: CoursMarche | undefined = this.marcheSelectionne();
    if (marcheSelectionne) {
      const idxCours = marcheSelectionne.cours.indexOf(this.coursSelectionne!);
      if (idxCours > 0) {
        this.coursSelectionne = marcheSelectionne.cours[idxCours - 1];
      }
    }
  }

  valeurSuivante() {
    const marcheSelectionne: CoursMarche | undefined = this.marcheSelectionne();
    if (marcheSelectionne) {
      const idxCours = marcheSelectionne.cours.indexOf(this.coursSelectionne!);
      if (idxCours !== -1 && idxCours + 1 < marcheSelectionne.cours.length) {
        this.coursSelectionne = marcheSelectionne.cours[idxCours + 1];
      }
    }
  }

  appliquerFiltre(filtreDecore: FiltreDecore | undefined) {
    this.filtreActif = filtreDecore;
    this.decorerCours();
    if (this.marches!.length > 0) {
      this.idxMarcheCourant = 0;
    }
  }
}
