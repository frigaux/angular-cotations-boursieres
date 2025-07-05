import {Component} from '@angular/core';

// TODO : faire fonctionner la version portrait + la version mobile ? ou bloquer les mobiles via supports-screens dans le manifest ?
@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.sass'
})
export class FooterComponent {
  navigator: Navigator;
  screen: Screen;

  constructor() {
    this.screen = window.screen;
    this.navigator = window.navigator;
  }

  telechargerApk() {
    window.open('app-debug.apk');
  }
}
