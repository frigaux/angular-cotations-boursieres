import {Component, input, InputSignal} from '@angular/core';
import {CurrencyPipe, DecimalPipe, PercentPipe} from '@angular/common';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOInformationsTickerABCBourse} from '../../../../services/abc-bourse/dto-informations-ticker-abc-bourse.class';

@Component({
  selector: 'app-fieldset-ratios',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    Fieldset,
    PercentPipe,
    TableModule,
    TranslatePipe
  ],
  templateUrl: './fieldset-ratios.component.html',
  styleUrl: './fieldset-ratios.component.sass'
})
export class FieldsetRatiosComponent {
  inputDTO: InputSignal<DTOInformationsTickerABCBourse | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});

  // données pour la vue
  dto?: DTOInformationsTickerABCBourse;

  private intercepteurDTO(dto: DTOInformationsTickerABCBourse | undefined) {
    this.dto = dto;
    return dto;
  }
}
