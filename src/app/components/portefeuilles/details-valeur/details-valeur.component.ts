import {Component, input, InputSignal, output} from '@angular/core';
import {CoursPortefeuille} from '../cours-portefeuille.class';
import {Panel} from 'primeng/panel';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {Cours} from '../../cours/cours.class';
import {ColonneAlertesComponent} from '../colonnes/alertes/colonne-alertes.component';
import {AlerteAvecSonEvaluation} from '../alerte-avec-son-evaluation.class';
import {TranslatePipe} from '@ngx-translate/core';
import {InformationsValeurComponent} from '../../cours/informations-valeur/informations-valeur.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    ChartsComponent,
    ColonneAlertesComponent,
    TranslatePipe,
    InformationsValeurComponent,
    NgClass
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCours: InputSignal<{
    coursPortefeuille: CoursPortefeuille,
    premier: boolean,
    dernier: boolean
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurCoursPortefeuille(o), alias: 'cours'});
  ferme = output<void>();
  precedent = output<void>();
  suivant = output<void>();

  // données pour la vue
  alertes: AlerteAvecSonEvaluation[] | undefined;
  dto?: { coursPortefeuille: CoursPortefeuille, premier: boolean, dernier: boolean };
  cours: Cours | undefined;
  informationsDetaillees: boolean = false;

  private intercepteurCoursPortefeuille(dto: {
    coursPortefeuille: CoursPortefeuille,
    premier: boolean,
    dernier: boolean
  } | undefined) {
    this.informationsDetaillees = false;
    this.dto = dto;
    this.alertes = dto?.coursPortefeuille.evaluerAlertes();
    this.cours = dto?.coursPortefeuille ? Cours.fromCoursPortefeuille(dto.coursPortefeuille) : undefined;
    return dto;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cours?.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cours?.ticker}p`);
  }
}
