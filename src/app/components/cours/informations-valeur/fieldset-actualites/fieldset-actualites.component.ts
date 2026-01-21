import {Component, input, InputSignal, output} from '@angular/core';
import {Fieldset} from 'primeng/fieldset';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOInformation} from '../../../../services/boursorama/dto-information.interface';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-fieldset-actualites',
  imports: [
    Fieldset,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './fieldset-actualites.component.html',
  styleUrl: './fieldset-actualites.component.sass'
})
export class FieldsetActualitesComponent {
  inputActualites: InputSignal<Array<DTOInformation> | undefined> = input(undefined,
    {transform: o => this.intercepteurActualites(o), alias: 'actualites'});
  afficherInformation = output<DTOInformation>();

  protected actualites?: Array<DTOInformation>;

  private intercepteurActualites(actualites: Array<DTOInformation> | undefined) {
    this.actualites = actualites;
    return actualites;
  }
}
