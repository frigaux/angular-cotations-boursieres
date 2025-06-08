import {Component, effect, input, InputSignal, output} from '@angular/core';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {DatePipe} from '@angular/common';
import {Panel} from 'primeng/panel';
import {ChartsComponent} from '../../valeurs/valeur/charts/charts.component';
import {Cours} from '../../cours/cours.class';

@Component({
  selector: 'app-cours',
  imports: [
    DatePipe,
    Panel,
    ChartsComponent
  ],
  templateUrl: './cours.component.html',
  styleUrl: './cours.component.sass'
})
export class CoursComponent {
  // input/output
  cours: InputSignal<CoursPortefeuille | undefined> = input();
  ferme = output<void>();

  // données pour la vue
  coursVue: Cours | undefined;

  constructor() {
    effect(() => {
      this.initChart();
    });
  }

  private initChart() {
    const cours: CoursPortefeuille | undefined = this.cours();
    if (cours) {
      this.coursVue = Cours.fromCoursPortefeuille(cours);
    }
  }
}
