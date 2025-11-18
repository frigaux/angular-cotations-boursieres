import {Component, OnInit} from '@angular/core';
import {LoaderComponent} from '../loader/loader.component';
import {TranslatePipe} from '@ngx-translate/core';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {CurrencyPipe, DatePipe, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AbcBourseService} from '../../services/abc-bourse/abc-bourse.service';
import {DividendeDecore} from './dividende-decore.interface';

@Component({
  selector: 'app-dividendes',
  imports: [
    LoaderComponent,
    TranslatePipe,
    DatePipe,
    TableModule,
    CurrencyPipe,
    PercentPipe
  ],
  templateUrl: './dividendes.component.html',
  styleUrls: ['./dividendes.component.sass', '../commun/titre.sass']
})
export class DividendesComponent implements OnInit {
  // chargement des valeurs et dividendes
  loading: boolean = true;

  // données pour la vue
  dateRecuperation?: string;
  dividendesDecores?: Array<DividendeDecore>;

  // private
  private valeurByTicker?: Map<string, DTOValeur>;

  constructor(private valeursService: ValeursService,
              private abcBourseService: AbcBourseService,
              private dividendesService: DividendesService) {
  }

  protected recupererDividendesABCBourse() {
    this.loading = true;
    this.abcBourseService.chargerDividendes().subscribe({
      next: dividendes => {
        this.dividendesService.enregistrer(dividendes);
        this.loading = false;
      },
      error:
        httpErrorResponse => {
          console.error(httpErrorResponse);
          this.loading = false
        }
    });
  }

  ngOnInit(): void {
    this.dividendesService.onUpdate(dividendes => this.construireVue());
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.construireVue();
      this.loading = false;
    });
  }

  private construireVue() {
    const dividendes = this.dividendesService.charger();
    if (dividendes) {
      this.dateRecuperation = dividendes.dateRecuperation;
      this.dividendesDecores = dividendes.dividendes.map(dividende => {
        const valeur = this.valeurByTicker!.get(dividende.ticker);
        return {dividende, valeur};
      });
    }
  }
}
