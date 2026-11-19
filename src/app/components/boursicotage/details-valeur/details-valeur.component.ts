import {Component, input, InputSignal, output} from '@angular/core';
import {Panel} from 'primeng/panel';
import {TranslatePipe} from '@ngx-translate/core';
import {NgClass} from '@angular/common';
import {CotationsDecorees} from '../cotations-decorees.class';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {InformationsValeurComponent} from '../../cours/informations-valeur/informations-valeur.component';
import {Cours} from '../../cours/cours.class';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    ChartsComponent,
    TranslatePipe,
    InformationsValeurComponent,
    NgClass
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCotations: InputSignal<CotationsDecorees | undefined> = input(undefined,
    {transform: o => this.intercepteurCotationsDecorees(o), alias: 'cotations'});
  ferme = output<void>();

  // données pour la vue
  cotationsDecorees: CotationsDecorees | undefined;
  cours: Cours | undefined;
  informationsDetaillees: boolean = false;

  private intercepteurCotationsDecorees(cotationsDecorees: CotationsDecorees | undefined) {
    this.informationsDetaillees = false;
    this.cotationsDecorees = cotationsDecorees;
    this.cours = cotationsDecorees && cotationsDecorees.cours ? Cours.fromValeurEtCours(cotationsDecorees.valeur, cotationsDecorees.cours) : undefined;
    return cotationsDecorees;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.cotationsDecorees?.valeur.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.cotationsDecorees?.valeur.ticker}p`);
  }
}
