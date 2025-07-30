import {Component, input, InputSignal, output} from '@angular/core';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {DatePipe} from '@angular/common';
import {Panel} from 'primeng/panel';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {Cours} from '../../cours/cours.class';
import {AlertesComponent} from '../alertes/alertes.component';
import {Alerte} from '../alerte.class';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-details-valeur',
  imports: [
    DatePipe,
    Panel,
    ChartsComponent,
    AlertesComponent,
    TranslatePipe
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

  private intercepteurCoursPortefeuille(coursPortefeuille: CoursPortefeuille | undefined) {
    this.coursPortefeuille = coursPortefeuille;
    this.alertes = coursPortefeuille?.alertes;
    this.cours = coursPortefeuille ? Cours.fromCoursPortefeuille(coursPortefeuille) : undefined;
    return coursPortefeuille;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cours?.ticker}/`);
  }
}
