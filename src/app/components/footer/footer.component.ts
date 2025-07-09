import {Component} from '@angular/core';
import {NgIf} from '@angular/common';

// TODO : colonne des alertes : indiquer la condition pour chaque alerte
// TODO : gestion du portefeuille afficher les détails de chaque portefeuille : condition ...
// TODO : colonnes à configuration dynamique selon media et orientation
@Component({
  selector: 'app-footer',
  imports: [
    NgIf
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  // données pour la vue
  navigator: Navigator;
  screen: Screen;
  devicePixelRatio: number;
  afficherDetails: boolean = false;

  constructor() {
    this.screen = window.screen;
    this.navigator = window.navigator;
    this.devicePixelRatio = window.devicePixelRatio;
  }

  telechargerApk() {
    window.open('/apk/app-debug.apk');
  }
}
