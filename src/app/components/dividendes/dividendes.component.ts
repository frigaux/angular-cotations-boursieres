import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderComponent} from '../loader/loader.component';
import {TranslatePipe} from '@ngx-translate/core';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {CurrencyPipe, DatePipe, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {DividendeDecore} from './dividende-decore.interface';
import {DialogImportExportComponent} from './dialog-import-export/dialog-import-export.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dividendes',
  imports: [
    LoaderComponent,
    TranslatePipe,
    DatePipe,
    TableModule,
    CurrencyPipe,
    PercentPipe,
    DialogImportExportComponent,
    DialogImportExportComponent
  ],
  templateUrl: './dividendes.component.html',
  styleUrls: ['./dividendes.component.sass', '../commun/titre.sass']
})
export class DividendesComponent implements OnInit, OnDestroy {
  // chargement des valeurs et dividendes
  loading: boolean = true;

  // données pour la vue
  dateRecuperation?: string;
  dividendesDecores?: Array<DividendeDecore>;

  // private
  private valeurByTicker?: Map<string, DTOValeur>;
  private onUpdateDividendes?: Subscription;

  constructor(private valeursService: ValeursService,
              private dividendesService: DividendesService) {
  }

  ngOnInit(): void {
    this.onUpdateDividendes = this.dividendesService.onUpdate(dividendes => this.construireVue());
    this.valeursService.chargerValeurs().subscribe(valeurs => {
      this.valeurByTicker = new Map<string, DTOValeur>();
      valeurs.forEach(valeur => this.valeurByTicker!.set(valeur.ticker, valeur));
      this.construireVue();
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.onUpdateDividendes?.unsubscribe();
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
