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
  dto?: { cours: Cours, premier: boolean, dernier: boolean };
  informationsDetaillees: boolean = false;

  private intercepteurCours(dto?: { cours: Cours, premier: boolean, dernier: boolean }) {
    this.informationsDetaillees = false;
    this.dto = dto;
    return dto;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.dto?.cours.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.dto?.cours.ticker}p`);
  }
}
