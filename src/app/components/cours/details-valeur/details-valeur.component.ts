import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {ChartMoyennesMobilesComponent} from '../chart-moyennes-mobiles/chart-moyennes-mobiles.component';
import {Cours} from '../cours.class';
import {InformationsTickerComponent} from '../informations-ticker/informations-ticker.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    TranslatePipe,
    ChartMoyennesMobilesComponent,
    InformationsTickerComponent,
    NgClass,
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});
  ferme = output<void>();
  precedent = output<void>();
  suivant = output<void>();

  cours?: Cours;
  informationsDetaillees: boolean = false;

  private intercepteurCours(cours: Cours | undefined) {
    this.informationsDetaillees = false;
    this.cours = cours;
    return cours;
  }
}
