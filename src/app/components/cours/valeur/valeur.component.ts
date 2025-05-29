import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {ChartMoyennesMobilesComponent} from '../../valeurs/valeur/chart-moyennes-mobiles/chart-moyennes-mobiles.component';
import {Cours} from '../cours.class';

@Component({
  selector: 'app-valeur',
  imports: [
    Panel,
    TranslatePipe,
    ChartMoyennesMobilesComponent,
  ],
  templateUrl: './valeur.component.html',
  styleUrl: './valeur.component.sass'
})
export class ValeurComponent {
  // input/output
  cours: InputSignal<Cours | undefined> = input();
  ferme = output<void>();
}
