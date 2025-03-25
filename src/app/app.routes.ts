import { Routes } from '@angular/router';

import { ValeursComponent } from './components/valeurs/valeurs.component';
import { PortefeuillesComponent } from './components/portefeuilles/portefeuilles.component';

export const routes: Routes = [
    { path: 'valeurs', component: ValeursComponent, title: 'Cotations des valeurs' },
    { path: 'portefeuilles', component: PortefeuillesComponent, title: 'Portefeuilles' },
    { path: '**', redirectTo: '/valeurs' }
];
