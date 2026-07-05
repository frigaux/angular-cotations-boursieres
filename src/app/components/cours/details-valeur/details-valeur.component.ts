import {Component, inject, input, InputSignal, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Panel} from 'primeng/panel';
import {Cours} from '../cours.class';
import {InformationsValeurComponent} from '../informations-valeur/informations-valeur.component';
import {NgClass} from '@angular/common';
import {ChartsComponent} from '../charts/charts.component';
import {CoursService} from '../../../services/cours/cours.service';
import {DTOValeur} from '../../../services/valeurs/dto-valeur.interface';
import {LoaderComponent} from '../../loader/loader.component';

@Component({
  selector: 'app-details-valeur',
  imports: [
    Panel,
    TranslatePipe,
    InformationsValeurComponent,
    NgClass,
    ChartsComponent,
    LoaderComponent,
  ],
  templateUrl: './details-valeur.component.html',
  styleUrl: './details-valeur.component.sass'
})
export class DetailsValeurComponent {
  private coursService = inject(CoursService);

  // chargement des cours pour la valeur
  loading: boolean = true;

  // input/output
  inputCours: InputSignal<{
    cours: Cours,
    valeur: DTOValeur,
    premier: boolean,
    dernier: boolean
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});
  ferme = output<void>();
  precedent = output<void>();
  suivant = output<void>();

  // données pour la vue
  dto?: { cours: Cours, premier: boolean, dernier: boolean };
  informationsDetaillees: boolean = false;

  private intercepteurCours(dto?: { cours: Cours, valeur: DTOValeur, premier: boolean, dernier: boolean }) {
    if (dto) {
      this.dto = dto;
      this.loading = true;
      this.coursService.chargerCoursTickerWithLimit(dto.cours.ticker, 300)
        .subscribe(coursAlleges => {
          dto.cours.coursAlleges = coursAlleges;
          this.loading = false;
        });
    }
    this.informationsDetaillees = false;
    return dto;
  }

  boursorama() {
    window.open(`https://www.boursorama.com/cours/1rP${this.dto?.cours.ticker}/`);
  }

  abcBourse() {
    window.open(`https://www.abcbourse.com/cotation/${this.dto?.cours.ticker}p`);
  }
}
