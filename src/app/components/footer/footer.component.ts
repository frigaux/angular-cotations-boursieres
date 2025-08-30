import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-footer',
  imports: [
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
    window.open(environment.staticPrefixUrl + '/apk/app-debug.apk');
  }
}
