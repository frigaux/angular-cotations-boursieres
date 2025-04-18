import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [Menubar, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  items: MenuItem[] = [
    {
      label: 'Valeurs',
      routerLink: 'valeurs',
      icon: 'pi pi-warehouse'
    },
    {
      label: 'Portefeuilles',
      routerLink: 'portefeuilles',
      icon: 'pi pi-chart-line'
    }
  ];

}
