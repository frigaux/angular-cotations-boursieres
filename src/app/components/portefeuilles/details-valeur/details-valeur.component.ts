import {Component, input, InputSignal, output} from '@angular/core';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {Panel} from 'primeng/panel';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {Cours} from '../../cours/cours.class';
import {AlertesComponent} from '../alertes/alertes.component';
import {Alerte} from '../alerte.class';
import {TranslatePipe} from '@ngx-translate/core';
import {InformationsTickerComponent} from '../../cours/informations-ticker/informations-ticker.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    ChartsComponent,
    AlertesComponent,
    TranslatePipe,
    InformationsTickerComponent,
    NgClass
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCours: InputSignal<CoursPortefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurCoursPortefeuille(o), alias: 'cours'});
  ferme = output<void>();

  // données pour la vue
  alertes: Alerte[] | undefined;
  coursPortefeuille?: CoursPortefeuille;
  cours: Cours | undefined;
  informationsDetaillees: boolean = false;

  private intercepteurCoursPortefeuille(coursPortefeuille: CoursPortefeuille | undefined) {
    this.informationsDetaillees = false;
    this.coursPortefeuille = coursPortefeuille;
    this.alertes = coursPortefeuille?.evaluerAlertes();
    this.cours = coursPortefeuille ? Cours.fromCoursPortefeuille(coursPortefeuille) : undefined;
    return coursPortefeuille;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cours?.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cours?.ticker}p`);
  }
}
