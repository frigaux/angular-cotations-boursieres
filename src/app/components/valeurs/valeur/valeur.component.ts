import {Component, effect, input, InputSignal, output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {CoursService} from '../../../services/cours/cours.service';
import {NgIf} from '@angular/common';
import {DTOCoursTickerLight} from '../../../services/cours/DTOCoursTickerLight';
import {ProgressBar} from 'primeng/progressbar';
import {Valeur} from '../Valeur';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {MoyennesMobilesComponent} from './moyennes-mobiles/moyennes-mobiles.component';
import {Cours} from '../../cours/Cours';

@Component({
  selector: 'app-valeur',
  imports: [
    Panel,
    NgIf,
    ProgressBar,
    DetailsValeurComponent,
    MoyennesMobilesComponent
  ],
  templateUrl: './valeur.component.html',
  styleUrl: './valeur.component.sass'
})
export class ValeurComponent {
  // input/output
  valeur: InputSignal<Valeur | undefined> = input();
  closed = output<void>();

  // chargement des cours
  loading: boolean = true;
  limit: number = 100;

  // données pour la vue
  cours: Cours | undefined;
  coursLight: DTOCoursTickerLight[] | undefined;

  constructor(private translateService: TranslateService, private coursService: CoursService) {
    effect(() => {
      this.initChart();
    });
  }

  initChart() {
    const valeur: Valeur | undefined = this.valeur();
    if (valeur) {
      this.loading = true;
      this.coursService.chargerCoursTicker(valeur.ticker).subscribe(cours => {
        this.cours = new Cours(valeur.ticker, valeur.libelle, cours);
        this.coursService.chargerCoursTickerWithLimit(valeur.ticker, this.limit).subscribe(cours => {
          this.coursLight = cours;
          this.loading = false;
        })
      });
    }
  }
}
