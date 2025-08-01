import {Component, OnInit} from '@angular/core';
import {CoursService} from '../../../services/cours/cours.service';
import {DTOFiltre} from '../../../services/cours/dto-filtre.interface';
import {TranslatePipe} from '@ngx-translate/core';
import {EditeurFiltresComponent} from '../editeur-filtres/editeur-filtres.component';

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
  filtres?: Array<DTOFiltre>;
  editeurVisible: boolean = false;

  constructor(private coursService: CoursService) {

  }

  ngOnInit(): void {
    this.filtres = this.coursService.chargerFiltres();
  }
}
