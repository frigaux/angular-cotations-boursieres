import {Component, input, InputSignal} from '@angular/core';
import {
  DTOInformationsTickerBoursorama
} from '../../../../../services/boursorama/dto-informations-ticker-boursorama.interface';
import {Fieldset} from 'primeng/fieldset';
import {TranslatePipe} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';

@Component({
  selector: 'app-fieldset-indicateurs',
  imports: [
    Fieldset,
    TranslatePipe,
    DecimalPipe,
    PercentPipe,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './fieldset-indicateurs.component.html',
  styleUrl: './fieldset-indicateurs.component.sass'
})
export class FieldsetIndicateursComponent {
  inputDTO: InputSignal<DTOInformationsTickerBoursorama | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});

  protected dto?: DTOInformationsTickerBoursorama;

  private intercepteurDTO(dto: DTOInformationsTickerBoursorama | undefined) {
    this.dto = dto;
    return dto;
  }
}
