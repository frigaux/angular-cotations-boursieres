import {Component, inject, OnInit, viewChild} from '@angular/core';
import {TableModule} from 'primeng/table';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {MarcheDecore} from './marche-decore.class';
import {Marches} from '../../services/valeurs/marches.enum';
import {DTOListeCours} from '../../services/cours/dto-liste-cours.interface';
import {Cours} from './cours.class';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {CurrencyPipe, DatePipe, NgClass, PercentPipe} from '@angular/common';
import {LoaderComponent} from '../loader/loader.component';
import {PopoverActionsValeurComponent} from './popover-actions-valeur/popover-actions-valeur.component';
import {SortEvent} from 'primeng/api';
import {SelecteurFiltreComponent} from './selecteur-filtre/selecteur-filtre.component';
import {FiltreDecore} from './selecteur-filtre/filtre-decore.class';
import {DialogImportExportComponent} from './dialog-editeur-filtres/import-export/dialog-import-export.component';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {DialogActualitesComponent} from './dialog-actualites/dialog-actualites.component';
import {VueUtil} from '../../services/commun/vue-util.class';
import {
  DialogEvaluationActualitesComponent
} from './dialog-evaluation-actualites/dialog-evaluation-actualites.component';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';

@Component({
  selector: 'app-cours',
  imports: [
    TableModule,
    TranslatePipe,
    DetailsValeurComponent,
    DatePipe,
    NgClass,
    CurrencyPipe,
    LoaderComponent,
    PercentPipe,
    PopoverActionsValeurComponent,
    SelecteurFiltreComponent,
    DialogImportExportComponent,
    DialogActualitesComponent,
    DialogEvaluationActualitesComponent,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs
  ],
  templateUrl: './cours.component.html',
  styleUrls: ['../portefeuilles/tabs-panel.sass', './cours.component.sass', '../commun/titre.sass']
})
export class CoursComponent implements OnInit {
  private actionsValeur = viewChild(PopoverActionsValeurComponent);

  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  date?: string;
  marches?: MarcheDecore[];
  idxMarcheCourant: number = NaN;
  protected readonly VueUtil = VueUtil;
  protected valeurByTicker?: Map<string, DTOValeur>;

  // cours pour lequel afficher les moyennes mobiles
  coursSelectionne?: { cours: Cours, premier: boolean, dernier: boolean };

  // private
  private translateService = inject(TranslateService);
  private listeCours?: DTOListeCours;
  private filtreActif?: FiltreDecore;
  private portefeuilles: boolean;
  private marcheSelectionne?: MarcheDecore;

  constructor(private valeursService: ValeursService,
              private coursService: CoursService,
              private portefeuillesService: PortefeuillesService) {
    this.portefeuilles = this.portefeuillesService.auMoinsUnPortefeuilleCorrectementConfigure();
  }

  ngOnInit(): void {
    this.chargerValeurs();
  }

  private chargerValeurs() {
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      for (const valeur of valeurs) {
        this.valeurByTicker.set(valeur.ticker, valeur);
      }
      this.chargerCours();
    });
  }

  chargerCours(): void {
    this.coursService.chargerCours().subscribe(liste => {
      this.listeCours = liste;
      this.construireVue();
      this.idxMarcheCourant = !this.idxMarcheCourant && this.marches!.length > 0 ? 0 : NaN;
      this.loading = false;
    })
  }

  private construireVue() {
    this.marches = [];
    this.coursSelectionne = undefined;

    if (this.listeCours && this.valeurByTicker) {
      this.date = this.listeCours.date;
      const coursByMarche = new Map<Marches, Cours[]>();

      this.listeCours.cours
        .map(dto => {
          const valeur = this.valeurByTicker!.get(dto.ticker);
          return Cours.fromDTOCours(this.listeCours!.date, valeur!.libelle, dto)
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
        this.marches!.push(new MarcheDecore(marche, this.translateService, cours));
      });
      this.marches!.sort((m1, m2) => m1.libelle.localeCompare(m2.libelle));
    }
  }

  onClickCours(event: MouseEvent, marche: MarcheDecore, cours: Cours) {
    if (event.target instanceof Element && event.target.tagName === 'SPAN' && this.portefeuilles) {
      this.afficherAjoutAuPortefeuille(event, cours);
    } else {
      this.basculerAffichageCours(marche, cours);
    }
  }

  private basculerAffichageCours(marche: MarcheDecore, cours: Cours) {
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
  trierColonne(event: SortEvent, marche: MarcheDecore) {
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
    this.construireVue();
    this.idxMarcheCourant = this.marches!.length > 0 ? 0 : NaN;
  }
}
