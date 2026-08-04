import {Component, inject, input, InputSignal} from '@angular/core';
import {Cours} from '../cours.class';
import {CoursService} from '../../../services/cours/cours.service';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {IndicateursUtil} from '../../../services/commun/indicateurs-util.class';
import {PercentPipe} from '@angular/common';

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
  private dividendesService = inject(DividendesService);

  // input/output
  inputCours: InputSignal<Cours | undefined> = input(undefined,
    {transform: o => this.intercepteurCours(o), alias: 'cours'});

  private cours: Cours | undefined;

  // données pour la vue
  pourcentageDividendes: number = 0;
  classeDividendes: string = '';
  pourcentageEcartType: number = 0;
  classeEcartType: string = '';

  private intercepteurCours(cours: Cours | undefined) {
    this.cours = cours;
    if (cours) {
      if (!cours.coursAlleges) {
        this.coursService.chargerCoursTickerWithLimit(cours.ticker, 300)
          .subscribe(coursAlleges => {
            cours.coursAlleges = coursAlleges;
            this.calculerIndicateurs();
          });
      } else {
        this.calculerIndicateurs();
      }
    }
    return cours;
  }

  private calculerIndicateurs() {
    if (this.cours) {
      this.pourcentageDividendes = this.calculerPourcentageDividendes();
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

  private calculerPourcentageDividendes(): number {
    const anneePrecedente = String(new Date().getFullYear() - 1);
    const dividendes = this.dividendesService.charger()?.dividendes
      .filter(dividende => {
        return dividende.ticker === this.cours!.ticker && dividende.date.substring(0, 4) === anneePrecedente;
      });
    if (dividendes) {
      const somme = dividendes.reduce((acc, dividende) => acc + dividende.montant, 0);
      return somme / this.cours!.cloture;
    }
    return 0;
  }
}
