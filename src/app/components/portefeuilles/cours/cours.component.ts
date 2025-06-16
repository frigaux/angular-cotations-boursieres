import {Component, input, InputSignal, output} from '@angular/core';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {DatePipe} from '@angular/common';
import {Panel} from 'primeng/panel';
import {ChartsComponent} from '../../valeurs/valeur/charts/charts.component';
import {Cours} from '../../cours/cours.class';
import {AlertesComponent} from '../alertes/alertes.component';
import {Alerte} from '../alerte.class';

@Component({
  selector: 'app-cours',
  imports: [
    DatePipe,
    Panel,
    ChartsComponent,
    AlertesComponent
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.sass'
})
export class CoursComponent {
  // input/output
  cours: InputSignal<CoursPortefeuille | undefined> = input(undefined,
    {transform: o => this.intercepteurCoursPortefeuille(o)});
  ferme = output<void>();

  // données pour la vue
  alertes: Alerte[] | undefined;
  coursVue: Cours | undefined;

  private intercepteurCoursPortefeuille(coursPortefeuille: CoursPortefeuille | undefined) {
    this.alertes = coursPortefeuille?.alertes;
    this.coursVue = coursPortefeuille ? Cours.fromCoursPortefeuille(coursPortefeuille) : undefined;
    return coursPortefeuille;
  }
}
