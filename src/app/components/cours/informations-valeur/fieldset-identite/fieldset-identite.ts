import {Component, input, InputSignal} from '@angular/core';
import {DTOIdentiteTickerAbcbourse} from '../../../../services/abc-bourse/dto-identite-ticker-abcbourse';
import {Fieldset} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {TranslatePipe} from '@ngx-translate/core';
import {DatePipe, DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-fieldset-identite',
  imports: [
    Fieldset,
    TableModule,
    TranslatePipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './fieldset-identite.html',
  styleUrl: './fieldset-identite.sass',
})
export class FieldsetIdentite {
  inputData: InputSignal<DTOIdentiteTickerAbcbourse | undefined> = input(undefined,
    {transform: dto => this.intercepteurDTOIdentiteTickerAbcbourse(dto), alias: 'identite'});

  identite?: DTOIdentiteTickerAbcbourse;

  private intercepteurDTOIdentiteTickerAbcbourse(dto: DTOIdentiteTickerAbcbourse | undefined) {
    this.identite = dto;
    return dto;
  }
}
