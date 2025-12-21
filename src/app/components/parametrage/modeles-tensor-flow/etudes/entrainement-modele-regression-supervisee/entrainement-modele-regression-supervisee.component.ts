import {Component} from '@angular/core';
import {DonneesService} from '../../../../../services/modeles-tensor-flow/etudes/regression-supervisee/donnees.service';

@Component({
  selector: 'app-entrainement-modele-regression-supervisee',
  imports: [],
  templateUrl: './entrainement-modele-regression-supervisee.component.html',
  styleUrl: './entrainement-modele-regression-supervisee.component.sass',
})
export class EntrainementModeleRegressionSuperviseeComponent {
  constructor(private donneesService: DonneesService) {}

  ngOnInit(): void {
    this.donneesService.donneesCoursVagues()
      .then(iterateurDonnees => {
      });
  }
}
