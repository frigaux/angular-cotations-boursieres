import {DTOValeur} from '../../../../services/valeurs/dto-valeur.interface';
import {DTOCoursTickerAllege} from '../../../../services/cours/dto-cours-ticker-allege.interface';

export class CoursDecore {
  valeur: DTOValeur;
  cours: DTOCoursTickerAllege[];
  nbVagues?: number;

  constructor(valeur: DTOValeur, cours: DTOCoursTickerAllege[]) {
    this.valeur = valeur;
    this.cours = cours;
  }
}
