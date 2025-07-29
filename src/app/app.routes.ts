import {Routes} from '@angular/router';

import {ValeursComponent} from './components/valeurs/valeurs.component';
import {PortefeuillesComponent} from './components/portefeuilles/portefeuilles.component';
import {authentificationGuard} from './authentification.guard';
import {AuthentificationComponent} from './components/authentification/authentification.component';
import {ErreurTechniqueComponent} from './components/erreur-technique/erreur-technique.component';
import {CoursComponent} from './components/cours/cours.component';
import {
  GestionPortefeuillesComponent
} from './components/portefeuilles/gestion-portefeuilles/gestion-portefeuilles.component';
import {GestionTableauxComponent} from './components/gestion-tableaux/gestion-tableaux.component';
import {AchatsValeursComponent} from './components/achats-valeurs/achats-valeurs.component';

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
  {path: '**', redirectTo: '/authentification'}
];
