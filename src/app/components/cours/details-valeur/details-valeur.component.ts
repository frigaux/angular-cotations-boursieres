import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {ChartMoyennesMobilesComponent} from '../chart-moyennes-mobiles/chart-moyennes-mobiles.component';
import {Cours} from '../cours.class';
import {InformationsValeurComponent} from '../informations-valeur/informations-valeur.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    TranslatePipe,
    ChartMoyennesMobilesComponent,
    InformationsValeurComponent,
    NgClass,
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCours: InputSignal<{ cours: Cours, premier: boolean, dernier: boolean } | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});
  ferme = output<void>();
  precedent = output<void>();
  suivant = output<void>();

  // données pour la vue
  cours?: { cours: Cours, premier: boolean, dernier: boolean };
  informationsDetaillees: boolean = false;

  private intercepteurCours(cours?: { cours: Cours, premier: boolean, dernier: boolean }) {
    this.informationsDetaillees = false;
    this.cours = cours;
    return cours;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cours?.cours.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cours?.cours.ticker}p`);
  }
}
