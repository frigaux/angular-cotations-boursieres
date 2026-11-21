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
import {ScreenOrientation} from '@capacitor/screen-orientation';
import {PrimeNG} from 'primeng/config';
import {PickList} from 'primeng/picklist';
import {NavigationBar} from '@squareetlabs/capacitor-navigation-bar';
import {LocalNotifications} from '@capacitor/local-notifications';

// TODO : capacitor android : proxy obligatoire pour requêter les autres domaines ? problème CORS ou pas ?
// TODO : examiner les logs du debugger android studio
// TODO : intégrer tailwind ?
// TODO : update @capacitor version to 8 et virer @squareetlabs/capacitor-navigation-bar
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  constructor(private translateService: TranslateService, private router: Router,
              private titleService: Title, private primeng: PrimeNG) {
    this.configurationTraduction();
    this.configurationAndroid();
    this.requestAndroidPermissions();
    this.createAndroidChannel();
    this.fixPrimeNgPickList();
  }

  private fixPrimeNgPickList() {
    PickList.prototype.triggerChangeDetection = function () {
      this.selectedItemsSource = [...this.selectedItemsSource];
      this.selectedItemsTarget = [...this.selectedItemsTarget];
    }
  }

  private configurationAndroid() {
    if (Capacitor.isNativePlatform()) {
      ScreenOrientation.lock({orientation: 'landscape'});
      StatusBar.hide();
      NavigationBar.hide();
    }
  }

  private configurationTraduction() {
    this.translateService.setTranslation('fr', translationsFR);
    this.translateService.addLangs(['fr']);
    this.translateService.setFallbackLang('fr');
    this.translateService.use('fr');
    this.primeng.setTranslation({
      dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
      monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec']
    })
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

  private async requestAndroidPermissions() {
    if (Capacitor.isNativePlatform()) {
      const permission = await LocalNotifications.checkPermissions();
      if (permission.display !== 'granted') {
        const request = await LocalNotifications.requestPermissions();
        if (request.display !== 'granted') {
          console.warn(this.translateService.instant('PERMISSION_NOTIFICATION_REFUSEE'));
        }
      }
    }
  }

  private async createAndroidChannel() {
    if (Capacitor.isNativePlatform()) {
      if (Capacitor.getPlatform() === 'android') {
        await LocalNotifications.createChannel({
          id: 'alertes_urgentes',
          name: 'Alertes urgentes',
          description: 'Notifications avec son, vibration et bannière',
          importance: 5, // 4 ou 5 requis pour faire apparaître la bannière (heads-up)
          visibility: 1, // 1 = Public (visible sur l'écran de verrouillage)
          vibration: true
        });
      }
    }
  }
}
