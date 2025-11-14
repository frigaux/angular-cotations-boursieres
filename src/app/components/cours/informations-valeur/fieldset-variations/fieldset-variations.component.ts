import {Component, input, InputSignal} from '@angular/core';
import {Fieldset} from 'primeng/fieldset';
import {TranslatePipe} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {NgClass, PercentPipe} from '@angular/common';
import {DTOVariationTicker} from '../../../../services/abc-bourse/dto-variation-ticker.class';

@Component({
  selector: 'app-fieldset-variations',
  imports: [
    Fieldset,
    TranslatePipe,
    TableModule,
    PercentPipe,
    NgClass
  ],
  templateUrl: './fieldset-variations.component.html',
  styleUrl: './fieldset-variations.component.sass'
})
export class FieldsetVariationsComponent {
  inputVariations: InputSignal<Array<DTOVariationTicker> | undefined> = input(undefined,
    {transform: o => this.intercepteurVariations(o), alias: 'variations'});

  // données pour la vue
  protected variations?: Array<DTOVariationTicker>;

  private intercepteurVariations(variations: Array<DTOVariationTicker> | undefined) {
    this.variations = variations;
    return variations;
  }
}
