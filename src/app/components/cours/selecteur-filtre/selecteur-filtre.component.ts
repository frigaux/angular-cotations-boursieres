import {Component, OnInit} from '@angular/core';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslatePipe} from '@ngx-translate/core';
import {EditeurFiltresComponent} from '../editeur-filtres/editeur-filtres.component';
import {FiltreDecore} from './filtre-decore.class';

// TODO : afficher les filtres et les appliquer
@Component({
  selector: 'app-selecteur-filtre',
  imports: [
    TranslatePipe,
    EditeurFiltresComponent
  ],
  templateUrl: './selecteur-filtre.component.html',
  styleUrl: './selecteur-filtre.component.sass'
})
export class SelecteurFiltreComponent implements OnInit {

  // données pour la vue
  filtresDecores?: FiltreDecore[];
  editeurVisible: boolean = false;

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
}
