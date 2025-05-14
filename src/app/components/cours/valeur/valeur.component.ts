import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {MoyennesMobilesComponent} from '../../valeurs/valeur/moyennes-mobiles/moyennes-mobiles.component';
import {Cours} from '../Cours';

@Component({
  selector: 'app-valeur',
  imports: [
    Panel,
    TranslatePipe,
    MoyennesMobilesComponent,
  ],
  templateUrl: './valeur.component.html',
  styleUrl: './valeur.component.sass'
})
export class ValeurComponent {
  // input/output
  cours: InputSignal<Cours | undefined> = input();
  closed = output<void>();
}
