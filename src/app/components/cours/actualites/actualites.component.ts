import {Component} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {DTOActualites} from '../../../services/abc-bourse/dto-actualites';
import {LoaderComponent} from '../../loader/loader.component';
import {Fieldset} from 'primeng/fieldset';
import {CurrencyPipe, DatePipe, DecimalPipe, NgClass, PercentPipe} from '@angular/common';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-actualites',
  imports: [
    Dialog,
    TranslatePipe,
    LoaderComponent,
    Fieldset,
    PercentPipe,
    TableModule,
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
    NgClass,
  ],
  templateUrl: './actualites.component.html',
  styleUrl: './actualites.component.sass'
})
export class ActualitesComponent {
  // chargement des actualités
  loading: boolean = true;

  // données pour la vue
  visible: boolean = false;
  actualites?: DTOActualites;

  constructor(private abcBourseService: AbcBourseService) {
  }

  reinitialiserVue() {
    this.abcBourseService.chargerActualites()
      .subscribe({
          error: httpResponseError => {
            this.loading = false;
          },
          next: dto => {
            this.actualites = dto;
            this.loading = false;
          }
        }
      );
  }
}
