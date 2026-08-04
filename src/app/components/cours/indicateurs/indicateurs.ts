import {Component, inject, input, InputSignal} from '@angular/core';
import {Cours} from '../cours.class';
import {CoursService} from '../../../services/cours/cours.service';
import {IndicateursUtil} from '../../../services/commun/indicateurs-util.class';
import {PercentPipe} from '@angular/common';
import {DTODividende} from '../../../services/dividendes/dto-dividende.interface';

@Component({
  selector: 'app-indicateurs',
  imports: [
    PercentPipe
  ],
  templateUrl: './indicateurs.html',
  styleUrl: './indicateurs.sass',
})
export class Indicateurs {
  private coursService = inject(CoursService);

  // input/output
  inputCours: InputSignal<{
    dividendesByTicker?: Map<string, Array<DTODividende>>,
    cours: Cours
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'dto'});

  private cours?: Cours;
  private dividendesByTicker?: Map<string, Array<DTODividende>>;

  // données pour la vue
  pourcentageDividendes: number = 0;
  classeDividendes: string = '';
  pourcentageEcartType: number = 0;
  classeEcartType: string = '';

  private intercepteurCours(dto: { dividendesByTicker?: Map<string, Array<DTODividende>>, cours: Cours } | undefined) {
    if (dto) {
      this.cours = dto.cours;
      this.dividendesByTicker = dto.dividendesByTicker;
      if (!this.cours.coursAlleges) {
        this.coursService.chargerCoursTickerWithLimit(this.cours.ticker, 300)
          .subscribe(coursAlleges => {
            this.cours!.coursAlleges = coursAlleges;
            this.calculerIndicateurs();
          });
      } else {
        this.calculerIndicateurs();
      }
    }
    return dto;
  }

  private calculerIndicateurs() {
    if (this.cours) {
      this.pourcentageDividendes = IndicateursUtil.calculerPourcentageDividendes(this.cours.ticker, this.cours.cloture, this.dividendesByTicker);
      this.classeDividendes = this.pourcentageDividendes > 0.08 ? 'fort' : this.pourcentageDividendes > 0.04 ? 'moyen' : 'leger';
      this.pourcentageEcartType = IndicateursUtil.calculerPourcentageEcartType(this.cours.coursAlleges!);
      this.classeEcartType = this.determinerClasseEcartType();
    }
  }

  private determinerClasseEcartType(): string {
    const nbMM = this.cours!.moyennesMobiles.length;
    if (nbMM > 10) {
      if (this.cours!.moyennesMobiles[4] > this.cours!.moyennesMobiles[nbMM - 1]) {
        return this.pourcentageEcartType > 0.1 ? 'pi-angle-double-up' : 'pi-angle-up';
      } else {
        return this.pourcentageEcartType > 0.1 ? 'pi-angle-double-down' : 'pi-angle-down';
      }
    }
    return '';
  }
}
