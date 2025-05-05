import {Routes} from '@angular/router';

import {ValeursComponent} from './components/valeurs/valeurs.component';
import {PortefeuillesComponent} from './components/portefeuilles/portefeuilles.component';
import {authentificationGuard} from './authentification.guard';
import {AuthentificationComponent} from './components/authentification/authentification.component';
import {ErreurTechniqueComponent} from './components/erreur-technique/erreur-technique.component';
import {CoursComponent} from './components/cours/cours.component';

export const routes: Routes = [
  {
    path: 'authentification',
    component: AuthentificationComponent,
    title: 'Authentification'
  },
  {
    path: 'erreur-technique',
    component: ErreurTechniqueComponent,
    title: 'Erreur technique'
  },
  {
    path: 'valeurs',
    component: ValeursComponent,
    title: 'Liste des valeurs',
    canActivate: [authentificationGuard]
  },
  {
    path: 'cours',
    component: CoursComponent,
    title: 'Cotation des valeurs',
    canActivate: [authentificationGuard]
  },
  {
    path: 'portefeuilles',
    component: PortefeuillesComponent,
    title: 'Portefeuilles',
    canActivate: [authentificationGuard]
  },
  {path: '**', redirectTo: '/authentification'}
];
