import {Component, OnInit} from '@angular/core';
import {InputNumber} from 'primeng/inputnumber';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {TranslatePipe} from '@ngx-translate/core';
import {Select, SelectChangeEvent} from 'primeng/select';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';
import {LoaderComponent} from '../loader/loader.component';
import {TableauCotationsComponent} from './tableau-cotations/tableau-cotations.component';
import {EtapeValeurUtil} from '../valeurs/achats-valeur/etape-valeur-util.class';
import {EtapeValeur} from '../valeurs/achats-valeur/etape-valeur.enum';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOAchatsTicker} from '../../services/valeurs/dto-achats-ticker.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {CotationsDecorees} from './cotations-decorees.class';
import {DatePipe, NgClass} from '@angular/common';
import {BourseDirectService} from '../../services/bourse-direct/bourse-direct.service';
import {Tooltip} from 'primeng/tooltip';
import {DTOCotations} from '../../services/bourse-direct/dto-cotations.interface';
import {CoursService} from '../../services/cours/cours.service';
import {DTOCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';

import {DetailsValeurComponent} from './details-valeur/details-valeur.component';

@Component({
  selector: 'app-boursicotage',
  imports: [
    InputNumber,
    ReactiveFormsModule,
    FormsModule,
    FloatLabel,
    TranslatePipe,
    Select,
    LoaderComponent,
    TableauCotationsComponent,
    DatePipe,
    Tooltip,
    DetailsValeurComponent,
    NgClass,
  ],
  templateUrl: './boursicotage.component.html',
  styleUrl: './boursicotage.component.sass',
})
export class BoursicotageComponent implements OnInit {
  public static readonly NB_JOURS = 300;

  // données pour la vue
  protected readonly EtapeValeur = EtapeValeur;
  loading: boolean = true; // chargement des cours depuis Boursorama
  protected portefeuilles?: Array<DTOPortefeuille>;
  protected cotationsOrdresAchats?: CotationsDecorees[];
  protected cotationsAchats?: CotationsDecorees[];
  protected cotationsOrdresVentes?: CotationsDecorees[];
  protected cotationsPortefeuille?: CotationsDecorees[];
  protected dateRafraichissement?: Date;
  protected cotationsByTicker?: Map<string, DTOCotations>;
  protected cotationsSelectionnees?: CotationsDecorees;

  // formulaire
  protected delaiRafraichissement: number = 60;
  protected seuilVariation: number = 1;
  protected portefeuille?: DTOPortefeuille;

  // private
  private valeurByTicker?: Map<string, DTOValeur>;
  private idInterval?: any;

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private coursService: CoursService,
              private bourseDirectService: BourseDirectService) {
  }

  ngOnInit(): void {
    this.portefeuilles = this.portefeuillesService.charger();
    const achats = this.valeursService.chargerAchats();
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.cotationsOrdresAchats = this.cotationsDecorees(achats, EtapeValeur.ORDRE_ACHAT);
      this.cotationsAchats = this.cotationsDecorees(achats, EtapeValeur.ACHAT);
      this.cotationsOrdresVentes = this.cotationsDecorees(achats, EtapeValeur.ORDRE_VENTE);
      this.chargerCoursTickersWithLimit();
      this.rafraichirCotations();
      this.programmerRafraichissementAutomatique();
    });
  }

  private cotationsDecorees(achats: Array<DTOAchatsTicker>, etape: EtapeValeur): CotationsDecorees[] {
    const resultat: CotationsDecorees[] = []
    EtapeValeurUtil.filtrerParEtape(achats, etape)
      .forEach(achats => {
        achats.achats.forEach(achat => {
          resultat.push(new CotationsDecorees(this.valeurByTicker!.get(achats.ticker)!, achat));
        })
      });
    return resultat;
  }

  protected selectionPortefeuille(event: SelectChangeEvent) {
    this.coursService.chargerCoursTickersWithLimit(this.portefeuille?.tickers || [], BoursicotageComponent.NB_JOURS)
      .subscribe(liste => {
        const coursByTicker = new Map<string, DTOCoursAvecListeAllege>();
        liste.forEach(cours => coursByTicker!.set(cours.ticker, cours));
        this.cotationsPortefeuille = this.portefeuille?.tickers
          .map(ticker => {
            const cotationsDecorees = new CotationsDecorees(this.valeurByTicker!.get(ticker)!);
            cotationsDecorees.cours = coursByTicker.get(cotationsDecorees.valeur.ticker)
            return cotationsDecorees;
          });
        this.rafraichirCotations();
        this.programmerRafraichissementAutomatique();
      });
  }

  protected selectionDelaiRafraichissement(event: Event) {
    if (this.delaiRafraichissement > 0 && this.delaiRafraichissement < 100) {
      this.programmerRafraichissementAutomatique();
    }
  }

  private programmerRafraichissementAutomatique() {
    if (this.idInterval) {
      clearInterval(this.idInterval);
    }
    this.idInterval = setInterval(() => this.rafraichirCotations(), this.delaiRafraichissement * 60 * 1000);
  }

  private rafraichirCotations() {
    const tickers = this.tickersDistincts([this.cotationsOrdresAchats, this.cotationsAchats, this.cotationsOrdresVentes, this.cotationsPortefeuille]);
    const cotationsByTicker = new Map<string, DTOCotations>();
    this.appelsSuccessifs(tickers.values(), cotationsByTicker);
  }

  private tickersDistincts(ll: (CotationsDecorees[] | undefined)[]): Set<string> {
    const resultat = new Set<string>();
    ll.forEach(l => l?.forEach(cotations => resultat.add(cotations.valeur.ticker)));
    return resultat;
  }

  private appelsSuccessifs(tickers: SetIterator<string>, cotationsByTicker: Map<string, DTOCotations>) {
    let nextTicker = tickers.next();
    if (!nextTicker.done) {
      const ticker = nextTicker.value;
      this.bourseDirectService.chargerCotationsTicker(ticker).subscribe({
        error: httpErrorResponse => {
          setTimeout(() => this.appelsSuccessifs(tickers, cotationsByTicker), Math.floor(100 + Math.random() * 400));
        },
        next: dto => {
          cotationsByTicker.set(ticker, dto);
          setTimeout(() => this.appelsSuccessifs(tickers, cotationsByTicker), Math.floor(100 + Math.random() * 400));
        }
      });
    } else {
      this.cotationsByTicker = cotationsByTicker;
      this.dateRafraichissement = new Date();
    }
  }

  private chargerCoursTickersWithLimit() {
    const tickers = this.tickersDistincts([this.cotationsOrdresAchats, this.cotationsAchats, this.cotationsOrdresVentes]);
    this.coursService.chargerCoursTickersWithLimit(Array.from(tickers), BoursicotageComponent.NB_JOURS)
      .subscribe(liste => {
        const coursByTicker = new Map<string, DTOCoursAvecListeAllege>();
        liste.forEach(cours => coursByTicker!.set(cours.ticker, cours));
        this.definirCours(this.cotationsOrdresAchats!, coursByTicker);
        this.definirCours(this.cotationsAchats!, coursByTicker);
        this.definirCours(this.cotationsOrdresVentes!, coursByTicker);
        this.loading = false;
      });
  }

  private definirCours(liste: CotationsDecorees[], coursByTicker: Map<string, DTOCoursAvecListeAllege>) {
    liste.forEach(cotations => cotations.cours = coursByTicker.get(cotations.valeur.ticker));
  }

  protected cotationsCliquees(cotations: CotationsDecorees) {
    if (this.cotationsSelectionnees === undefined
      || this.cotationsSelectionnees.valeur.ticker !== cotations.valeur.ticker) {
      this.cotationsSelectionnees = cotations;
    } else {
      this.cotationsSelectionnees = undefined;
    }
  }
}
