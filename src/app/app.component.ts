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

// TODO : service ABCBourse de récupération des informations pour un ticker : récupérer la pré-ouverture ?
// TODO : récupérer les événements boursier sur https://www.zonebourse.com/actualite-bourse/regions/locales/ : possibilité ajout dans un portefeuille des tickers
// TODO : nouvelle page dividende : date dernier import, un dividende par ticker avec date, type, montant, rendement (https://abcbourse.com/marches/dividendes)
// TODO : nouvelles opérandes pour les alertes du portefeuille/cours min/max/moyenne/nombre vagues
// TODO : capacitor android : proxy obligatoire pour autres domaines ? problème CORS ou pas ?
// TODO : coverage
// TODO : examiner les logs du debugger android studio
// TODO : intégrer tailwind ?
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
    this.translateService.setDefaultLang('fr');
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
}
