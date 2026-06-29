import {Routes} from '@angular/router';
import {authentificationGuard} from './authentification.guard';

export const routes: Routes = [
  {
    path: 'authentification',
    loadComponent: () =>
      import('./components/authentification/authentification.component').then(
        (m) => m.AuthentificationComponent
      )
  },
  {
    path: 'erreur-technique',
    loadComponent: () =>
      import('./components/erreur-technique/erreur-technique.component').then(
        (m) => m.ErreurTechniqueComponent
      )
  },
  {
    path: 'valeurs',
    loadComponent: () =>
      import('./components/valeurs/valeurs.component').then(
        (m) => m.ValeursComponent
      ),
    canActivate: [authentificationGuard]
  },
  {
    path: 'cours',
    loadComponent: () =>
      import('./components/cours/cours.component').then(
        (m) => m.CoursComponent
      ),
    canActivate: [authentificationGuard]
  },
  {
    path: 'achats-valeurs',
    loadComponent: () =>
      import('./components/achats-valeurs/achats-valeurs.component').then(
        (m) => m.AchatsValeursComponent
      ),
    canActivate: [authentificationGuard]
  },
  {
    path: 'dividendes',
    loadComponent: () =>
      import('./components/dividendes/dividendes.component').then(
        (m) => m.DividendesComponent
      ),
    canActivate: [authentificationGuard]
  },
  {
    path: 'portefeuilles',
    loadComponent: () =>
      import('./components/portefeuilles/portefeuilles.component').then(
        (m) => m.PortefeuillesComponent
      ),
    canActivate: [authentificationGuard]
  },
  {
    path: 'gestion-portefeuilles',
    loadComponent: () =>
      import(
        './components/parametrage/gestion-portefeuilles/gestion-portefeuilles.component'
      ).then((m) => m.GestionPortefeuillesComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'gestion-tableaux',
    loadComponent: () =>
      import(
        './components/parametrage/gestion-tableaux/gestion-tableaux.component'
      ).then((m) => m.GestionTableauxComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'sauvegarde-restauration',
    loadComponent: () =>
      import(
        './components/parametrage/sauvegarde-restauration/sauvegarde-restauration.component'
      ).then((m) => m.SauvegardeRestaurationComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'regression-supervisee',
    loadComponent: () =>
      import(
        './components/parametrage/modeles-tensor-flow/tutoriels/regression-supervisee/regression-supervisee.component'
      ).then((m) => m.RegressionSuperviseeComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'classification-supervisee-convolutive',
    loadComponent: () =>
      import(
        './components/parametrage/modeles-tensor-flow/tutoriels/classification-supervisee-convolutive/classification-supervisee-convolutive.component'
      ).then((m) => m.ClassificationSuperviseeConvolutiveComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'generateur-donnees-entrainement-modele',
    loadComponent: () =>
      import(
        './components/parametrage/modeles-tensor-flow/etudes/generateur-donnees-entrainement-modele/generateur-donnees-entrainement-modele.component'
      ).then((m) => m.GenerateurDonneesEntrainementModeleComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'entrainement-modele-regression-supervisee',
    loadComponent: () =>
      import(
        './components/parametrage/modeles-tensor-flow/etudes/entrainement-modele-regression-supervisee/entrainement-modele-regression-supervisee.component'
      ).then((m) => m.EntrainementModeleRegressionSuperviseeComponent),
    canActivate: [authentificationGuard]
  },
  {
    path: 'entrainement-modele-classification-supervisee',
    loadComponent: () =>
      import(
        './components/parametrage/modeles-tensor-flow/etudes/entrainement-modele-classification-supervisee/entrainement-modele-classification-supervisee.component'
      ).then((m) => m.EntrainementModeleClassificationSuperviseeComponent),
    canActivate: [authentificationGuard]
  },
  {path: '**', redirectTo: '/authentification'}
];
