import {Component, inject, input, InputSignal} from '@angular/core';
import {CoursService} from '../../../services/cours/cours.service';
import {IndicateursUtil} from '../../../services/commun/indicateurs-util.class';
import {PercentPipe} from '@angular/common';
import {DTODividende} from '../../../services/dividendes/dto-dividende.interface';
import {TranslatePipe} from '@ngx-translate/core';
import {DTOCoursTickerAllege} from '../../../services/cours/dto-cours-ticker-allege.interface';

@Component({
  selector: 'app-indicateurs',
  imports: [
    PercentPipe,
    TranslatePipe
  ],
  templateUrl: './indicateurs.html',
  styleUrl: './indicateurs.sass',
})
export class Indicateurs {
  private coursService = inject(CoursService);

  // input/output
  inputCours: InputSignal<{
    ticker: string,
    cloture: number,
    coursAlleges?: DTOCoursTickerAllege[],
    moyennesMobiles: number[],
    dividendes: Array<DTODividende>,
  } | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'dto'});

  private ticker?: string;
  private cloture?: number;
  private moyennesMobiles?: number[];
  private coursAlleges?: DTOCoursTickerAllege[];
  private dividendes?: Array<DTODividende>;

  // données pour la vue
  pourcentageDividendes: number = 0;
  classeDividendes: string = '';
  pourcentageEcartType: number = 0;
  classeEcartType: string = '';

  private intercepteurCours(dto: {
    ticker: string,
    cloture: number,
    coursAlleges?: DTOCoursTickerAllege[],
    moyennesMobiles: number[],
    dividendes: Array<DTODividende>,
  } | undefined) {
    if (dto) {
      this.ticker = dto.ticker;
      this.cloture = dto.cloture;
      this.coursAlleges = dto.coursAlleges;
      this.moyennesMobiles = dto.moyennesMobiles;
      this.dividendes = dto.dividendes;
      if (!this.coursAlleges) {
        this.coursService.chargerCoursTickerWithLimit(this.ticker, 300)
          .subscribe(coursAlleges => {
            this.coursAlleges = coursAlleges;
            this.calculerIndicateurs();
          });
      } else {
        this.calculerIndicateurs();
      }
    }
    return dto;
  }

  private calculerIndicateurs() {
    this.pourcentageDividendes = IndicateursUtil.calculerPourcentageDividendes(this.ticker!, this.cloture!, this.dividendes!);
    this.classeDividendes = this.pourcentageDividendes > 0.08 ? 'fort' : this.pourcentageDividendes > 0.04 ? 'moyen' : 'leger';
    this.pourcentageEcartType = IndicateursUtil.calculerPourcentageEcartType(this.coursAlleges!);
    this.classeEcartType = this.determinerClasseEcartType();
  }

  private determinerClasseEcartType(): string {
    const nbMM = this.moyennesMobiles!.length;
    if (nbMM > 50) {
      if (this.moyennesMobiles![19] > this.moyennesMobiles![nbMM - 1]) { // tendance haussière
        return this.pourcentageEcartType > 0.1 ? 'pi-angle-double-up' : 'pi-angle-up';
      } else { // tendance baissière
        return this.pourcentageEcartType > 0.1 ? 'pi-angle-double-down' : 'pi-angle-down';
      }
    }
    return '';
  }
}
