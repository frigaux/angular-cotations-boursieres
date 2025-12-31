import {Routes} from '@angular/router';

import {ValeursComponent} from './components/valeurs/valeurs.component';
import {PortefeuillesComponent} from './components/portefeuilles/portefeuilles.component';
import {authentificationGuard} from './authentification.guard';
import {AuthentificationComponent} from './components/authentification/authentification.component';
import {ErreurTechniqueComponent} from './components/erreur-technique/erreur-technique.component';
import {CoursComponent} from './components/cours/cours.component';
import {
  GestionPortefeuillesComponent
} from './components/parametrage/gestion-portefeuilles/gestion-portefeuilles.component';
import {GestionTableauxComponent} from './components/parametrage/gestion-tableaux/gestion-tableaux.component';
import {AchatsValeursComponent} from './components/achats-valeurs/achats-valeurs.component';
import {
  SauvegardeRestaurationComponent
} from './components/parametrage/sauvegarde-restauration/sauvegarde-restauration.component';
import {DividendesComponent} from './components/dividendes/dividendes.component';
import {
  RegressionSuperviseeComponent
} from './components/parametrage/modeles-tensor-flow/tutoriels/regression-supervisee/regression-supervisee.component';
import {
  ClassificationSuperviseeConvolutiveComponent
} from './components/parametrage/modeles-tensor-flow/tutoriels/classification-supervisee-convolutive/classification-supervisee-convolutive.component';
import {
  GenerateurDonneesEntrainementModeleComponent
} from './components/parametrage/modeles-tensor-flow/etudes/generateur-donnees-entrainement-modele/generateur-donnees-entrainement-modele.component';
import {
  EntrainementModeleRegressionSuperviseeComponent
} from './components/parametrage/modeles-tensor-flow/etudes/entrainement-modele-regression-supervisee/entrainement-modele-regression-supervisee.component';
import {
  EntrainementModeleClassificationSuperviseeComponent
} from './components/parametrage/modeles-tensor-flow/etudes/entrainement-modele-classification-supervisee/entrainement-modele-classification-supervisee.component';

export const routes: Routes = [
  {
    path: 'authentification',
    component: AuthentificationComponent
  },
  {
    path: 'erreur-technique',
    component: ErreurTechniqueComponent
  },
  {
    path: 'valeurs',
    component: ValeursComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'cours',
    component: CoursComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'achats-valeurs',
    component: AchatsValeursComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'dividendes',
    component: DividendesComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'portefeuilles',
    component: PortefeuillesComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'gestion-portefeuilles',
    component: GestionPortefeuillesComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'gestion-tableaux',
    component: GestionTableauxComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'sauvegarde-restauration',
    component: SauvegardeRestaurationComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'regression-supervisee',
    component: RegressionSuperviseeComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'classification-supervisee-convolutive',
    component: ClassificationSuperviseeConvolutiveComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'generateur-donnees-entrainement-modele',
    component: GenerateurDonneesEntrainementModeleComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'entrainement-modele-regression-supervisee',
    component: EntrainementModeleRegressionSuperviseeComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'entrainement-modele-classification-supervisee',
    component: EntrainementModeleClassificationSuperviseeComponent,
    canActivate: [authentificationGuard]
  },
  {path: '**', redirectTo: '/authentification'}
];
