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
import {YahooService} from '../../services/yahoo/yahoo.service';
import {DTOCotations} from '../../services/yahoo/dto-cotations.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {CotationsDecorees} from './cotations-decorees.class';
import {DatePipe} from '@angular/common';

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
    DatePipe
  ],
  templateUrl: './boursicotage.component.html',
  styleUrl: './boursicotage.component.sass',
})
export class BoursicotageComponent implements OnInit {
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

  // formulaire
  protected delaiRafraichissement: number = 60;
  protected seuilVariation: number = 1;
  protected portefeuille?: DTOPortefeuille;

  // private
  private valeurByTicker?: Map<string, DTOValeur>;
  private idInterval?: any;

  constructor(private portefeuillesService: PortefeuillesService,
              private valeursService: ValeursService,
              private yahooService: YahooService) {
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
      this.loading = false;
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
    this.cotationsPortefeuille = this.portefeuille?.tickers
      .map(ticker => new CotationsDecorees(this.valeurByTicker!.get(ticker)!));
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
    if (this.cotationsOrdresAchats && this.cotationsAchats && this.cotationsOrdresVentes) {
      const tickers = this.tickersDistincts();
      const cotationsByTicker = new Map<string, DTOCotations>();
      this.appelsSuccessifs(tickers.values(), cotationsByTicker);
    }
  }

  private tickersDistincts(): Set<string> {
    const resultat = new Set<string>();
    if (this.cotationsOrdresAchats && this.cotationsAchats && this.cotationsOrdresVentes) {
      this.cotationsOrdresAchats.forEach(cotations => resultat.add(cotations.valeur.ticker));
      this.cotationsAchats.forEach(cotations => resultat.add(cotations.valeur.ticker));
      this.cotationsOrdresVentes.forEach(cotations => resultat.add(cotations.valeur.ticker));
      if (this.cotationsPortefeuille) {
        this.cotationsPortefeuille.forEach(cotations => resultat.add(cotations.valeur.ticker));
      }
    }
    return resultat;
  }

  private appelsSuccessifs(tickers: SetIterator<string>, cotationsByTicker: Map<string, DTOCotations>) {
    let nextTicker = tickers.next();
    if (!nextTicker.done) {
      const ticker = nextTicker.value;
      this.yahooService.chargerCotationsTicker(ticker).subscribe({
        error: httpErrorResponse => {
          this.appelsSuccessifs(tickers, cotationsByTicker);
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
}
