import {Component, input, InputSignal} from '@angular/core';
import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';
import {DividendeDecore} from './dividende-decore.class';

@Component({
  selector: 'app-colonne-dividendes',
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './colonne-dividendes.component.html',
  styleUrl: './colonne-dividendes.component.sass'
})
export class ColonneDividendesComponent {
  // input/output
  inputDividendes: InputSignal<Array<DTODividende> | undefined> = input([],
    {transform: o => this.intercepteurDividendes(o), alias: 'dividendes'});
  inputReduit: InputSignal<boolean | undefined> = input(undefined,
    {transform: o => this.intercepteurReduit(o), alias: 'reduit'});

  // données pour la vue
  dividendesDecores?: Array<DividendeDecore>;
  reduit?: boolean;

  private intercepteurDividendes(dividendes?: Array<DTODividende>) {
    this.dividendesDecores = dividendes?.sort((d1, d2) => d1.date.localeCompare(d2.date))
      .map((dividende, id) => new DividendeDecore(id, dividende));
    return dividendes;
  }

  private intercepteurReduit(petit: boolean | undefined) {
    this.reduit = petit;
    return petit;
  }
}
