import {Component, input, InputSignal} from '@angular/core';
import {CurrencyPipe, PercentPipe} from '@angular/common';
import {Fieldset} from 'primeng/fieldset';
import {JaugeComponent} from '../../../../commun/jauge/jauge.component';
import {TranslatePipe} from '@ngx-translate/core';
import {CotationsValeurBoursoramaDecore} from '../cotations-valeur-boursorama-genere.class';
import {ClassVariation} from '../../../../../directives/class-variation';

@Component({
  selector: 'app-fieldset-cotations',
  imports: [
    CurrencyPipe,
    Fieldset,
    JaugeComponent,
    PercentPipe,
    TranslatePipe,
    ClassVariation
  ],
  templateUrl: './fieldset-cotations.component.html',
  styleUrl: './fieldset-cotations.component.sass'
})
export class FieldsetCotationsComponent {
  inputDTO: InputSignal<CotationsValeurBoursoramaDecore | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});

  protected cotationsTickerDecore?: CotationsValeurBoursoramaDecore;

  private intercepteurDTO(dto: CotationsValeurBoursoramaDecore | undefined) {
    this.cotationsTickerDecore = dto;
    return dto;
  }
}
