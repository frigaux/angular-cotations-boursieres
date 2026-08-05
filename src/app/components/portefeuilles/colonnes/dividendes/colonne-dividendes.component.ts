import {Component, input, InputSignal} from '@angular/core';
import {DTODividende} from '../../../../services/dividendes/dto-dividende.interface';
import {CurrencyPipe, DatePipe, NgClass, PercentPipe} from '@angular/common';
import {DividendeDecore} from './dividende-decore.class';

@Component({
  selector: 'app-colonne-dividendes',
  imports: [
    CurrencyPipe,
    DatePipe,
    NgClass,
    PercentPipe
  ],
  templateUrl: './colonne-dividendes.component.html',
  styleUrl: './colonne-dividendes.component.sass'
})
export class ColonneDividendesComponent {
  // input/output
  inputDTO: InputSignal<{ dividendes: Array<DTODividende>, cloture: number } | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});
  inputReduit: InputSignal<boolean | undefined> = input(undefined,
    {transform: o => this.intercepteurReduit(o), alias: 'reduit'});

  // données pour la vue
  dividendesDecores?: Array<DividendeDecore>;
  reduit?: boolean;

  private intercepteurDTO(dto?: { cloture: number, dividendes: Array<DTODividende> }) {
    console.log(dto);
    this.dividendesDecores = dto?.dividendes.sort((d1, d2) => d1.date.localeCompare(d2.date))
      .map((dividende, id) => new DividendeDecore(id, dividende, dto.cloture));
    return dto;
  }

  private intercepteurReduit(petit: boolean | undefined) {
    this.reduit = petit;
    return petit;
  }
}
