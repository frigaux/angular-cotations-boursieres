import {Component, input, InputSignal, output} from '@angular/core';
import {CurrencyPipe, DecimalPipe, PercentPipe} from '@angular/common';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {
  DTOInformationsTickerBoursorama
} from '../../../../../services/boursorama/dto-informations-ticker-boursorama.interface';
import {DTOInformation} from '../../../../../services/boursorama/dto-information.interface';

@Component({
  selector: 'app-fieldset-previsions',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    Fieldset,
    PercentPipe,
    TableModule,
    TranslatePipe
  ],
  templateUrl: './fieldset-previsions.component.html',
  styleUrls: ['./fieldset-previsions.component.sass', '../fieldset-actualites/fieldset-actualites.component.sass']
})
export class FieldsetPrevisionsComponent {
  inputDTO: InputSignal<DTOInformationsTickerBoursorama | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});
  afficherInformation = output<DTOInformation>();

  protected dto?: DTOInformationsTickerBoursorama;

  private intercepteurDTO(dto: DTOInformationsTickerBoursorama | undefined) {
    this.dto = dto;
    return dto;
  }
}
