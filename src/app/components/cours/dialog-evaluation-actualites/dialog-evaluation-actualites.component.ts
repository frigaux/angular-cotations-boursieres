import {Component, input, InputSignal, viewChild} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {LoaderComponent} from '../../loader/loader.component';
import {TranslatePipe} from '@ngx-translate/core';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';
import {DTOActualitesZoneBourse} from '../../../services/zone-bourse/dto-actualites-zone-bourse.interface';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {PopoverActionsValeurComponent} from '../popover-actions-valeur/popover-actions-valeur.component';
import {DTOValeur} from '../../../services/valeurs/dto-valeur.interface';

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
  // input/output
  inputValeurs: InputSignal<Map<string, DTOValeur>> = input(new Map<string, DTOValeur>(),
    {transform: o => this.intercepteurValeurs(o), alias: 'valeurs'});

  // private
  private actionsValeur = viewChild(PopoverActionsValeurComponent);
  private valeurByTicker: Map<string, DTOValeur> = new Map<string, DTOValeur>();

  // données pour la vue
  visible: boolean = false;
  loading: boolean = false;
  heure?: Date;
  actualites?: Array<DTOActualitesZoneBourse>;

  constructor(private zoneBourseService: ZoneBourseService) {
  }

  private intercepteurValeurs(valeurByTicker: Map<string, DTOValeur>) {
    this.valeurByTicker = valeurByTicker;
    return valeurByTicker;
  }

  protected reinitialiserVue() {
    this.loading = true;
    this.heure = new Date();
    this.zoneBourseService.chargerActualites(2, this.valeurByTicker)
      .subscribe({
        next: actualites => {
          this.actualites = actualites;
          this.loading = false;
        },
        error:
          httpErrorResponse => this.loading = false
      });
  }

  protected onClickTicker(event: MouseEvent, actualite: DTOActualitesZoneBourse) {
    if (actualite.ticker) {
      this.actionsValeur()?.afficher(event, actualite.ticker);
    }
  }
}
