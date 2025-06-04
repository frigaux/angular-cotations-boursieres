import {Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {TranslateService} from "@ngx-translate/core";
import translationsFR from "../../public/i18n/fr.json";
import {Title} from '@angular/platform-browser';

// TODO : courbes des MMxx glissantes
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  constructor(private translateService: TranslateService, private router: Router, private titleService: Title) {
    this.translateService.setTranslation('fr', translationsFR);
    this.translateService.addLangs(['fr']);
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const translateKey = event.url.substring(1)
          .replaceAll('-', '_')
          .toUpperCase();
        titleService.setTitle(translateService.instant(`ROUTER.${translateKey}`));
      }
    });
  }
}
