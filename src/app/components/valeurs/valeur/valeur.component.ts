import {Component, effect, input, InputSignal, output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {ProgressBar} from 'primeng/progressbar';
import {Valeur} from '../valeur.class';
import {DetailsValeurComponent} from './details-valeur/details-valeur.component';
import {Cours} from '../../cours/cours.class';
import {ChartsComponent} from './charts/charts.component';
import {Drawer} from 'primeng/drawer';

@Component({
  selector: 'app-valeur',
  imports: [
    NgIf,
    ProgressBar,
    DetailsValeurComponent,
    NgClass,
    ChartsComponent,
    DatePipe,
    Drawer
  ],
  templateUrl: './valeur.component.html',
  styleUrl: './valeur.component.sass'
})
export class ValeurComponent {
  // input/output
  valeur: InputSignal<Valeur | undefined> = input();
  ferme = output<void>();

  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  cours: Cours | undefined;

  constructor(private translateService: TranslateService, private coursService: CoursService) {
    effect(() => {
      this.initChart();
    });
  }

  initChart() {
    const valeur: Valeur | undefined = this.valeur();
    if (valeur) {
      this.loading = true;
      this.coursService.chargerCoursTicker(valeur.ticker).subscribe(dto => {
        this.coursService.chargerCoursTickerWithLimit(valeur.ticker, 300).subscribe(coursAlleges => {
          this.cours = Cours.fromDTOCoursTicker(valeur.ticker, valeur.libelle, dto, coursAlleges);
          this.loading = false;
        })
      });
    }
  }
}
