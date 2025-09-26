import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {ChartMoyennesMobilesComponent} from '../chart-moyennes-mobiles/chart-moyennes-mobiles.component';
import {Cours} from '../cours.class';
import {InformationsTickerComponent} from '../informations-ticker/informations-ticker.component';
import {NgClass} from '@angular/common';
import {Capacitor} from '@capacitor/core';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    TranslatePipe,
    ChartMoyennesMobilesComponent,
    InformationsTickerComponent,
    NgClass,
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});
  ferme = output<void>();
  precedent = output<void>();
  suivant = output<void>();

  // données pour la vue
  cours?: Cours;
  informationsDetaillees: boolean = false;
  isNativePlatform: boolean = Capacitor.isNativePlatform(); // Android/iOS

  private intercepteurCours(cours: Cours | undefined) {
    this.informationsDetaillees = false;
    this.cours = cours;
    return cours;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cours?.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cours?.ticker}p`);
  }
}
