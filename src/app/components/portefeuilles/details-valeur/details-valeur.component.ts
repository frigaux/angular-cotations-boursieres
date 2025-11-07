import {Component, input, InputSignal, output} from '@angular/core';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {Panel} from 'primeng/panel';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {Cours} from '../../cours/cours.class';
import {AlertesComponent} from '../colonnes/alertes/alertes.component';
import {AlerteAvecSonEvaluation} from '../alerte-avec-son-evaluation.class';
import {TranslatePipe} from '@ngx-translate/core';
import {InformationsValeurComponent} from '../../cours/informations-valeur/informations-valeur.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    ChartsComponent,
    AlertesComponent,
    TranslatePipe,
    InformationsValeurComponent,
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
  alertes: AlerteAvecSonEvaluation[] | undefined;
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
