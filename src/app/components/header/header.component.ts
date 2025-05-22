import {Component} from '@angular/core';

import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {CommonModule} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [Menubar, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  items: MenuItem[];

  constructor(private translateService: TranslateService) {
    this.items = [
      {
        label: translateService.instant('COMPOSANTS.HEADER.VALEURS'),
        routerLink: 'valeurs',
        icon: 'pi pi-warehouse'
      },
      {
        label: translateService.instant('COMPOSANTS.HEADER.COURS'),
        routerLink: 'cours',
        icon: 'pi pi-list'
      },
      {
        label: translateService.instant('COMPOSANTS.HEADER.PORTEFEUILLES'),
        routerLink: 'portefeuilles',
        icon: 'pi pi-chart-line'
      },
      {
        label: translateService.instant('COMPOSANTS.HEADER.GESTION_PORTEFEUILLES'),
        routerLink: 'gestion-portefeuilles',
        icon: 'pi pi-chart-line'
      }
    ];
  }
}
