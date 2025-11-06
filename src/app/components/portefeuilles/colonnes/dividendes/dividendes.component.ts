import {Component, input, InputSignal} from '@angular/core';
import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-dividendes',
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './dividendes.component.html',
  styleUrl: './dividendes.component.sass'
})
export class DividendesComponent {
  // input/output
  inputDividendes: InputSignal<Array<DTODividende> | undefined> = input([],
    {transform: o => this.intercepteurDividendes(o), alias: 'dividendes'});

  // données pour la vue
  dividendes: Array<DTODividende> | undefined;

  private intercepteurDividendes(dividendes: Array<DTODividende> | undefined) {
    this.dividendes = dividendes?.sort((d1, d2) => d1.date.localeCompare(d2.date));
    return dividendes;
  }
}
