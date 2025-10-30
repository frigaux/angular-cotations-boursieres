import {Component, input, InputSignal, output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {DatePipe} from '@angular/common';
import {Valeur} from '../valeur.class';
import {EncartsValeurComponent} from './encarts-valeur/encarts-valeur.component';
import {Cours} from '../../cours/cours.class';
import {ChartsComponent} from '../../cours/charts/charts.component';
import {LoaderComponent} from '../../loader/loader.component';
import {Panel} from 'primeng/panel';

@Component({
  selector: 'app-details-valeur',
  imports: [
    EncartsValeurComponent,
    ChartsComponent,
    DatePipe,
    LoaderComponent,
    Panel
  ],
  templateUrl: './details-valeur.component.html',
  styleUrls: ['./details-valeur.component.sass', '../../commun/titre.sass']
})
export class DetailsValeurComponent {
  // input/output
  inputValeur: InputSignal<Valeur | undefined> = input(undefined,
    {transform: o => this.intercepteurValeur(o), alias: 'valeur'});
  ferme = output<void>();

  valeur: Valeur | undefined;

  // chargement des cours
  loading: boolean = true;

  // données pour la vue
  cours: Cours | undefined;

  constructor(private translateService: TranslateService, private coursService: CoursService) {
  }

  private intercepteurValeur(valeur: Valeur | undefined) {
    this.valeur = valeur;
    this.initChart();
    return valeur;
  }

  initChart() {
    if (this.valeur) {
      const valeur = this.valeur;
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
