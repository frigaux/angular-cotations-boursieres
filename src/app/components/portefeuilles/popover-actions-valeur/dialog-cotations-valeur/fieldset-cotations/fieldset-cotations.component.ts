import {Component, input, InputSignal} from '@angular/core';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {Fieldset} from 'primeng/fieldset';
import {JaugeComponent} from '../../../../commun/jauge/jauge.component';
import {TranslatePipe} from '@ngx-translate/core';
import {VueUtil} from '../../../../commun/vue-util.class';
import {CotationsValeurBoursoramaDecore} from '../cotations-valeur-boursorama-genere.class';

@Component({
  selector: 'app-fieldset-cotations',
  imports: [
    CurrencyPipe,
    Fieldset,
    JaugeComponent,
    PercentPipe,
    TranslatePipe
  ],
  templateUrl: './fieldset-cotations.component.html',
  styleUrl: './fieldset-cotations.component.sass'
})
export class FieldsetCotationsComponent {
  inputDTO: InputSignal<CotationsValeurBoursoramaDecore | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});

  protected cotationsTickerDecore?: CotationsValeurBoursoramaDecore;
  protected readonly VueUtil = VueUtil;

  private intercepteurDTO(dto: CotationsValeurBoursoramaDecore | undefined) {
    this.cotationsTickerDecore = dto;
    return dto;
  }
}
