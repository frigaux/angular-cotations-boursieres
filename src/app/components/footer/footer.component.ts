import {Component} from '@angular/core';

// TODO : essayer avec les media query de changer la font-size sur root
// TODO : colonne des alertes : indiquer la condition pour chaque alerte
// TODO : gestion du portefeuille afficher les détails de chaque portefeuille : condition ...
// TODO : colonnes à configuration dynamique selon media et orientation
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  navigator: Navigator;
  screen: Screen;
  devicePixelRatio: number;

  constructor() {
    this.screen = window.screen;
    this.navigator = window.navigator;
    this.devicePixelRatio = window.devicePixelRatio;
  }

  telechargerApk() {
    window.open('/apk/app-debug.apk');
  }
}
