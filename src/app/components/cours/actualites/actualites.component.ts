import {Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {DTOActualites} from '../../../services/abc-bourse/dto-actualites';
import {LoaderComponent} from '../../loader/loader.component';
import {Fieldset} from 'primeng/fieldset';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DTOTransaction} from '../../../services/abc-bourse/dto-transaction.class';

@Component({
  selector: 'app-actualites',
  imports: [
    Dialog,
    TranslatePipe,
    LoaderComponent,
    Fieldset,
    PercentPipe,
    TableModule,
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
    NgClass,
  ],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.sass'
})
export class ActualitesComponent {
  // chargement des actualités
  loading: boolean = true;

  // données pour la vue
  visible: boolean = false;
  actualites?: DTOActualites;
  acquisitions?: Array<DTOTransaction>;
  cessions?: Array<DTOTransaction>;

  constructor(private abcBourseService: AbcBourseService) {
  }

  reinitialiserVue() {
    this.abcBourseService.chargerActualites()
      .subscribe({
          error: httpResponseError => {
            this.loading = false;
          },
          next: dto => {
            this.actualites = dto;
            this.acquisitions = dto.transactionsDirigeants
              .filter(transaction => transaction.operation === 'Acquisition' || transaction.operation === 'Souscription')
              .sort((t1, t2) => t2.montant - t1.montant);
            this.cessions = dto.transactionsDirigeants
              .filter(transaction => transaction.operation === 'Cession')
              .sort((t1, t2) => t2.montant - t1.montant);
            this.loading = false;
          }
        }
      );
  }
}
