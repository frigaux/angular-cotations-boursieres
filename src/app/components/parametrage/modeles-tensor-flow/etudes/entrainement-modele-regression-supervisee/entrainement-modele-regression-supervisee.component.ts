import {Component, OnInit} from '@angular/core';
import {DonneesService} from '../../../../../services/modeles-tensor-flow/etudes/regression-supervisee/donnees.service';

@Component({
  selector: 'app-entrainement-modele-regression-supervisee',
  imports: [],
  templateUrl: './entrainement-modele-regression-supervisee.component.html',
  styleUrl: './entrainement-modele-regression-supervisee.component.sass',
})
export class EntrainementModeleRegressionSuperviseeComponent implements OnInit {
  constructor(private donneesService: DonneesService) {
  }

  ngOnInit(): void {
    this.donneesService.donneesCoursVagues()
      .then(pontDonnees => {
        console.log(
          pontDonnees.donneesNormaliseesEntrainement().entrees.arraySync(),
          pontDonnees.donneesNormaliseesEntrainement().sorties.arraySync(),
          pontDonnees.entreesNormaliseesPredictions().arraySync(),
          pontDonnees.sortiesPredictions().arraySync());
      });
  }
}
