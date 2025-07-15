import {Component} from '@angular/core';

import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {CommonModule} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';

@Component({
  selector: 'app-header',
  imports: [Menubar, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  items: MenuItem[] = [];

  constructor(private translateService: TranslateService, private portefeuillesService: PortefeuillesService) {
    portefeuillesService.onUpdate(portefeuilles => this.makeItems(translateService))
    this.makeItems(translateService);
  }

  private makeItems(translateService: TranslateService) {
    this.items = [
      {
        label: translateService.instant('COMPOSANTS.HEADER.VALEURS'),
        routerLink: 'valeurs',
        icon: 'pi pi-warehouse'
      },
      {
        label: translateService.instant('COMPOSANTS.HEADER.COURS'),
        routerLink: 'cours',
        icon: 'pi pi-chart-line'
      }
    ];
    if (this.portefeuillesService.auMoinsUnPortefeuilleCorrectementConfigure()) {
      this.items.push({
        label: translateService.instant('COMPOSANTS.HEADER.PORTEFEUILLES'),
        routerLink: 'portefeuilles',
        icon: 'pi pi-book'
      });
    }
    this.items.push({
      label: translateService.instant('COMPOSANTS.HEADER.GESTION_PORTEFEUILLES'),
      routerLink: 'gestion-portefeuilles',
      icon: 'pi pi-wrench'
    });
    this.items.push({
      label: translateService.instant('COMPOSANTS.HEADER.GESTION_TABLEAUX'),
      routerLink: 'gestion-tableaux',
      icon: 'pi pi-wrench'
    });
  }
}
