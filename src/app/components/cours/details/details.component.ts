import {Component, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {ChartMoyennesMobilesComponent} from '../chart-moyennes-mobiles/chart-moyennes-mobiles.component';
import {Cours} from '../cours.class';

@Component({
  selector: 'app-details',
  imports: [
    Panel,
    TranslatePipe,
    ChartMoyennesMobilesComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.sass'
})
export class DetailsComponent {
  // input/output
  cours: InputSignal<Cours | undefined> = input();
  ferme = output<void>();
}
