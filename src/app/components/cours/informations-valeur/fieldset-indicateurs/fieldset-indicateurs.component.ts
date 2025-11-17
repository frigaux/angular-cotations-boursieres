import {Component, input, InputSignal} from '@angular/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOInformationsTickerABCBourse} from '../../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';
import {
  DTOInformationsTickerBoursorama
} from '../../../../services/boursorama/dto-informations-ticker-boursorama.interface';

@Component({
  selector: 'app-fieldset-indicateurs',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    Fieldset,
    PercentPipe,
    TableModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './fieldset-indicateurs.component.html',
  styleUrl: './fieldset-indicateurs.component.sass'
})
export class FieldsetIndicateursComponent {
  inputData: InputSignal<{
    dtoAbcBourse: DTOInformationsTickerABCBourse,
    dtoBoursorama: DTOInformationsTickerBoursorama
  } | undefined>
    = input(undefined, {transform: o => this.intercepteurData(o), alias: 'data'});

  // données pour la vue
  dtoAbcBourse?: DTOInformationsTickerABCBourse;
  dtoBoursorama?: DTOInformationsTickerBoursorama;

  private intercepteurData(data: {
    dtoAbcBourse: DTOInformationsTickerABCBourse,
    dtoBoursorama: DTOInformationsTickerBoursorama
  } | undefined) {
    this.dtoAbcBourse = undefined;
    this.dtoBoursorama = undefined;
    if (data) {
      this.dtoAbcBourse = data.dtoAbcBourse;
      this.dtoBoursorama = data.dtoBoursorama;
    }
    return data;
  }
}
