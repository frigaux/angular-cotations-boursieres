import {Component, OnInit} from '@angular/core';
import {DonneesService} from '../../../../../services/modeles-tensor-flow/etudes/regression-supervisee/donnees.service';
import {ParametresModele} from '../../commun/formulaire-modele/parametres-modele.interface';
import {ModeleEtDonnees} from '../../commun/explorateur-modele/modele-et-donnees.interface';
import {PontDonnees} from '../../../../../services/modeles-tensor-flow/etudes/regression-supervisee/pont-donnees.class';
import {TranslatePipe} from '@ngx-translate/core';
import {FormulaireModeleComponent} from '../../commun/formulaire-modele/formulaire-modele.component';
import {Button} from 'primeng/button';
import {BarreProgressionComponent} from '../../../../commun/barre-progression/barre-progression.component';
import {ExplorateurModeleComponent} from '../../commun/explorateur-modele/explorateur-modele.component';

@Component({
  selector: 'app-entrainement-modele-regression-supervisee',
  imports: [
    TranslatePipe,
    FormulaireModeleComponent,
    Button,
    BarreProgressionComponent,
    ExplorateurModeleComponent
  ],
  templateUrl: './entrainement-modele-regression-supervisee.component.html',
  styleUrl: './entrainement-modele-regression-supervisee.component.sass',
})
export class EntrainementModeleRegressionSuperviseeComponent implements OnInit {
  protected parametresModele: ParametresModele = {
    tauxApprentissage: 0.1,
    iterations: 50,
    lot: 32,
    optimiseur: 'adam',
    fonctionsPertes: ['meanSquaredError'],
    metriques: ['binaryAccuracy']
  };

  // données, modèle, couches
  protected pontDonnees?: PontDonnees;
  protected progressionEntrainement: number = 0;
  protected modeleEtDonnees?: ModeleEtDonnees;

  constructor(private donneesService: DonneesService) {
  }

  ngOnInit(): void {
    this.donneesService.donneesCoursVagues()
      .then(pontDonnees => {
        this.pontDonnees = pontDonnees;
        console.log(
          pontDonnees.donneesNormaliseesEntrainement().entrees.arraySync(),
          pontDonnees.donneesNormaliseesEntrainement().sorties.arraySync(),
          pontDonnees.entreesNormaliseesPredictions().arraySync(),
          pontDonnees.sortiesPredictions().arraySync());
      });
  }

  protected entrainerModele() {
    if (this.pontDonnees) {
      this.modeleEtDonnees = undefined;
    }
  }
}
