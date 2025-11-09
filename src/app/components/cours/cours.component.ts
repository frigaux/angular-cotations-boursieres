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
import {PopoverActionsValeurComponent} from './popover-actions-valeur/popover-actions-valeur.component';
import {SortEvent} from 'primeng/api';
import {SelecteurFiltreComponent} from './selecteur-filtre/selecteur-filtre.component';
import {FiltreDecore} from './selecteur-filtre/filtre-decore.class';
import {DialogImportExportComponent} from './dialog-editeur-filtres/import-export/dialog-import-export.component';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {DialogActualitesComponent} from './dialog-actualites/dialog-actualites.component';
import {VueUtil} from '../commun/vue-util.class';
import {
  DialogEvaluationActualitesComponent
} from './dialog-evaluation-actualites/dialog-evaluation-actualites.component';

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
    DialogActualitesComponent,
    DialogEvaluationActualitesComponent
  ],
  templateUrl: './cours.component.html',
  styleUrls: ['../portefeuilles/accordion-chart.sass', './cours.component.sass', '../commun/titre.sass']
})
export class CoursComponent implements OnInit {
  private actionsValeur = viewChild(PopoverActionsValeurComponent);

  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  date?: string;
  marches?: CoursMarche[];
  idxMarcheCourant: number = -1;
  protected readonly VueUtil = VueUtil;
  protected readonly valeurByTicker: Map<string, DTOValeur> = new Map<string, DTOValeur>();

  // cours pour lequel afficher les moyennes mobiles
  coursSelectionne?: { cours: Cours, premier: boolean, dernier: boolean };

  // private
  private translateService = inject(TranslateService);
  private liste?: DTOListeCours;
  private filtreActif?: FiltreDecore;
  private portefeuilles: boolean;
  private marcheSelectionne?: CoursMarche;

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
    this.coursSelectionne = undefined;

    if (this.liste && this.valeurByTicker) {
      this.date = this.liste.date;
      const coursByMarche = new Map<Marches, Cours[]>();

      this.liste.cours
        .map(dto => {
          const valeur = this.valeurByTicker!.get(dto.ticker);
          return Cours.fromDTOCours(this.liste!.date, valeur!.libelle, dto)
        })
        .filter(c => {
          if (!this.filtreActif) {
            return true;
          } else {
            return this.filtreActif.evaluer(c.moyennesMobiles,
              this.filtreActif.avecOperandeMIN ? c.calculerMinimumMM() : undefined,
              this.filtreActif.avecOperandeMAX ? c.calculerMaximumMM() : undefined,
              this.filtreActif.avecOperandeMOY ? c.calculerMoyenneMM() : undefined);
          }
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

  onClickCours(event: MouseEvent, marche: CoursMarche, cours: Cours) {
    if (event.target instanceof Element && event.target.tagName === 'SPAN' && this.portefeuilles) {
      this.afficherAjoutAuPortefeuille(event, cours);
    } else {
      this.basculerAffichageCours(marche, cours);
    }
  }

  private basculerAffichageCours(marche: CoursMarche, cours: Cours) {
    if (this.coursSelectionne === undefined || this.coursSelectionne.cours.ticker !== cours.ticker) {
      this.marcheSelectionne = marche;
      const idxCours = this.marcheSelectionne.cours.indexOf(cours);
      this.coursSelectionne = {
        cours,
        premier: idxCours === 0,
        dernier: idxCours === this.marcheSelectionne.cours.length - 1
      };
    } else {
      this.marcheSelectionne = undefined;
      this.coursSelectionne = undefined;
    }
  }

  private afficherAjoutAuPortefeuille(event: MouseEvent, cours: Cours) {
    this.actionsValeur()?.afficher(event, cours.ticker);
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

  valeurPrecedente() {
    if (this.marcheSelectionne) {
      const idxCours = this.marcheSelectionne.cours.indexOf(this.coursSelectionne!.cours);
      if (idxCours > 0) {
        const cours = this.marcheSelectionne.cours[idxCours - 1];
        this.coursSelectionne = {
          cours,
          premier: idxCours - 1 === 0,
          dernier: false
        };
      }
    }
  }

  valeurSuivante() {
    if (this.marcheSelectionne) {
      const idxCours = this.marcheSelectionne.cours.indexOf(this.coursSelectionne!.cours);
      if (idxCours !== -1 && idxCours + 1 < this.marcheSelectionne.cours.length) {
        const cours = this.marcheSelectionne.cours[idxCours + 1];
        this.coursSelectionne = {
          cours,
          premier: false,
          dernier: idxCours + 1 === this.marcheSelectionne.cours.length - 1
        };
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
