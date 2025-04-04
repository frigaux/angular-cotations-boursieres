import { Routes } from '@angular/router';

import { ValeursComponent } from './components/valeurs/valeurs.component';
import { PortefeuillesComponent } from './components/portefeuilles/portefeuilles.component';
import { authentificationGuard } from './authentification.guard';
import { AuthentificationComponent } from './components/authentification/authentification.component';

export const routes: Routes = [
    {
        path: 'authentification',
        component: AuthentificationComponent,
        title: 'Authentification'
    },
    {
        path: 'valeurs',
        component: ValeursComponent,
        title: 'Cotations des valeurs',
        canActivate: [authentificationGuard]
    },
    {
        path: 'portefeuilles',
        component: PortefeuillesComponent,
        title: 'Portefeuilles',
        canActivate: [authentificationGuard]
    },
    { path: '**', redirectTo: '/authentification' }
];
