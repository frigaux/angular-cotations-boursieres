import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from './MenuItem';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass'
})
export class HeaderComponent {
  menu: readonly MenuItem[] = [
    { label: 'Valeurs', routerLink: 'valeurs' },
    { label: 'Portefeuilles', routerLink: 'portefeuilles' }
  ];

}
