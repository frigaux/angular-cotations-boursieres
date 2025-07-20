import {Component} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {TranslateService} from "@ngx-translate/core";
import translationsFR from "../../public/i18n/fr.json";
import {Title} from '@angular/platform-browser';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {StatusBar} from '@capacitor/status-bar';
import {Capacitor} from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';

// TODO : courbes des MMxx glissantes
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  constructor(private translateService: TranslateService, private router: Router, private titleService: Title) {
    this.configurationTraduction();
    this.configurationAndroid();
  }

  private configurationAndroid() {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({orientation: 'landscape'});
      StatusBar.hide();
    }
  }

  private configurationTraduction() {
    this.translateService.setTranslation('fr', translationsFR);
    this.translateService.addLangs(['fr']);
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');
    this.traductionTitrePageDeLaRoute();
  }

  private traductionTitrePageDeLaRoute() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const translateKey = event.url.substring(1)
          .replaceAll('-', '_')
          .toUpperCase();
        this.titleService.setTitle(this.translateService.instant(`ROUTER.${translateKey}`));
      }
    });
  }
}
