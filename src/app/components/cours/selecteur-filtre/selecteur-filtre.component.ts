import {Component, OnInit, output} from '@angular/core';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslatePipe} from '@ngx-translate/core';
import {DialogEditeurFiltresComponent} from '../editeur-filtres/dialog-editeur-filtres.component';
import {FiltreDecore} from './filtre-decore.class';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-selecteur-filtre',
  imports: [
    TranslatePipe,
    DialogEditeurFiltresComponent,
    NgClass
  ],
  templateUrl: './selecteur-filtre.component.html',
  styleUrl: './selecteur-filtre.component.sass'
})
export class SelecteurFiltreComponent implements OnInit {
  selection = output<FiltreDecore | undefined>();

  // données pour la vue
  filtresDecores?: FiltreDecore[];
  editeurVisible: boolean = false;
  filtreActif?: FiltreDecore;

  constructor(private coursService: CoursService) {
  }

  ngOnInit(): void {
    this.coursService.onImportFiltres(filtres => this.decorerFiltres());
    this.coursService.onUpdateFiltres(filtres => this.decorerFiltres());
    this.decorerFiltres();
  }

  private decorerFiltres() {
    let i = 0;
    this.filtresDecores = this.coursService.chargerFiltres()
      .map(filtre => new FiltreDecore(i++, filtre));
  }

  appliquerFiltre(filtreDecore: FiltreDecore) {
    if (this.filtreActif !== filtreDecore) {
      this.filtreActif = filtreDecore;
    } else {
      this.filtreActif = undefined;
    }
    this.selection.emit(this.filtreActif);
  }
}
