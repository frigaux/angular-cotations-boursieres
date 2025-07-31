import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {ChartMoyennesMobilesComponent} from '../chart-moyennes-mobiles/chart-moyennes-mobiles.component';
import {Cours} from '../cours.class';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    TranslatePipe,
    ChartMoyennesMobilesComponent,
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inmutCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});
  ferme = output<void>();

  cours?: Cours;

  private intercepteurCours(cours: Cours | undefined) {
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
