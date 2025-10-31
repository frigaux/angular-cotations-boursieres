import {Component, viewChild} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../loader/loader.component';
import {TranslatePipe} from '@ngx-translate/core';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';
import {DTOActualitesZoneBourse} from '../../../services/zone-bourse/dto-actualites-zone-bourse.interface';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {PopoverActionsValeurComponent} from '../popover-actions-valeur/popover-actions-valeur.component';

@Component({
  selector: 'app-dialog-evaluation-actualites',
  imports: [
    Dialog,
    LoaderComponent,
    TranslatePipe,
    TableModule,
    DatePipe,
    PopoverActionsValeurComponent
  ],
  templateUrl: './dialog-evaluation-actualites.component.html',
  styleUrls: ['./dialog-evaluation-actualites.component.sass', '../../commun/barre-superieure.sass']
})
export class DialogEvaluationActualitesComponent {
  private actionsValeur = viewChild(PopoverActionsValeurComponent);

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  heure?: Date;
  actualites?: Array<DTOActualitesZoneBourse>;

  constructor(private zoneBourseService: ZoneBourseService) {
  }

  protected reinitialiserVue() {
    this.loading = true;
    this.heure = new Date();
    this.zoneBourseService.chargerActualites(2)
      .subscribe(actualites => {
        this.actualites = actualites;
        this.loading = false;
      });
  }

  protected onClickTicker(event: MouseEvent, actualite: DTOActualitesZoneBourse) {
    this.actionsValeur()?.afficher(event, actualite.ticker);
  }
}
