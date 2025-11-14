import {Component, input, InputSignal} from '@angular/core';
import {Fieldset} from 'primeng/fieldset';
import {TranslatePipe} from '@ngx-translate/core';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {DTODividendeTicker} from '../../../../services/abc-bourse/dto-dividende-ticker.class';
import {Cours} from '../../cours.class';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-fieldset-dividendes',
  imports: [
    Fieldset,
    TranslatePipe,
    CurrencyPipe,
    TableModule,
    PercentPipe
  ],
  templateUrl: './fieldset-dividendes.component.html',
  styleUrl: './fieldset-dividendes.component.sass'
})
export class FieldsetDividendesComponent {
  inputData: InputSignal<{ dividendes: Array<DTODividendeTicker>, cours: Cours } | undefined> = input(undefined,
    {transform: o => this.intercepteurData(o), alias: 'data'});

  // données pour la vue
  cours?: Cours;
  dividendes?: Array<DTODividendeTicker>;
  pourcentageDividendes?: number;


  private intercepteurData(data: { dividendes: Array<DTODividendeTicker>; cours: Cours } | undefined) {
    this.cours = data?.cours;
    this.dividendes = data?.dividendes;
    this.pourcentageDividendes = undefined;
    if (this.cours && this.dividendes) {
      this.pourcentageDividendes = this.dividendes.length > 0 ? this.dividendes[0].montant / this.cours.cloture : 0;
    }
    return data;
  }
}
