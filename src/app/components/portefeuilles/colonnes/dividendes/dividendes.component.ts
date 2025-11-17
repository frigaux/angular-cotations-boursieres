import {Component, input, InputSignal} from '@angular/core';
import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {DividendeDecore} from './dividende-decore.class';

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
  dividendesDecores?: Array<DividendeDecore>;

  private intercepteurDividendes(dividendes?: Array<DTODividende>) {
    this.dividendesDecores = dividendes?.sort((d1, d2) => d1.date.localeCompare(d2.date))
      .map((dividende, id) => new DividendeDecore(id, dividende));
    return dividendes;
  }
}
