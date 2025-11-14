import {Component, input, InputSignal, output} from '@angular/core';
import {Fieldset} from 'primeng/fieldset';
import {TranslatePipe} from '@ngx-translate/core';
import {
  DTOInformationsTickerBoursorama
} from '../../../../../services/boursorama/dto-informations-ticker-boursorama.interface';
import {DTOInformation} from '../../../../../services/boursorama/dto-information.interface';

@Component({
  selector: 'app-fieldset-actualites',
  imports: [
    Fieldset,
    TranslatePipe
  ],
  templateUrl: './fieldset-actualites.component.html',
  styleUrl: './fieldset-actualites.component.sass'
})
export class FieldsetActualitesComponent {
  inputDTO: InputSignal<DTOInformationsTickerBoursorama | undefined> = input(undefined,
    {transform: o => this.intercepteurDTO(o), alias: 'dto'});
  afficherInformation = output<DTOInformation>();

  protected dto?: DTOInformationsTickerBoursorama;

  private intercepteurDTO(dto: DTOInformationsTickerBoursorama | undefined) {
    this.dto = dto;
    return dto;
  }
}
