import {Component} from '@angular/core';

import {MenuItem} from 'primeng/api';
import {Menubar} from 'primeng/menubar';
import {CommonModule} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';

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
    portefeuillesService.onImport(portefeuilles => this.makeItems(translateService))
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
      },
      {
        label: translateService.instant('COMPOSANTS.HEADER.ACHATS_VALEURS'),
        routerLink: 'achats-valeurs',
        icon: 'pi pi-shopping-bag'
      },
      {
        label: translateService.instant('COMPOSANTS.HEADER.DIVIDENDES'),
        routerLink: 'dividendes',
        icon: 'pi pi-gift'
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
      label: translateService.instant('COMPOSANTS.HEADER.SOUS_MENU_PARAMETRAGE'),
      icon: 'pi pi-cog',
      items: [
        {
          label: translateService.instant('COMPOSANTS.HEADER.PARAMETRAGE.GESTION_PORTEFEUILLES'),
          routerLink: 'gestion-portefeuilles',
          icon: 'pi pi-wrench'
        },
        {
          label: translateService.instant('COMPOSANTS.HEADER.PARAMETRAGE.GESTION_TABLEAUX'),
          routerLink: 'gestion-tableaux',
          icon: 'pi pi-wrench'
        },
        {
          label: translateService.instant('COMPOSANTS.HEADER.PARAMETRAGE.SAUVEGARDE_RESTAURATION'),
          routerLink: 'sauvegarde-restauration',
          icon: 'pi pi-sync'
        },
        {
          label: translateService.instant('COMPOSANTS.HEADER.PARAMETRAGE.REGRESSION_SUPERVISEE'),
          routerLink: 'regression-supervisee',
          icon: 'pi pi-wrench'
        },
        {
          label: translateService.instant('COMPOSANTS.HEADER.PARAMETRAGE.CLASSIFICATION_SUPERVISEE_CONVOLUTIVE'),
          routerLink: 'classification-supervisee-convolutive',
          icon: 'pi pi-wrench'
        },
        {
          label: translateService.instant('COMPOSANTS.HEADER.PARAMETRAGE.GENERATEUR_DONNEES_ENTRAINEMENT_MODELE'),
          routerLink: 'generateur-donnees-entrainement-modele',
          icon: 'pi pi-wrench'
        }
      ]
    });
  }
}
