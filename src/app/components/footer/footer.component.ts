import {Component} from '@angular/core';

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
}
