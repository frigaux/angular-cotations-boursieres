import {DTOValeur} from '../../../valeurs/dto-valeur.interface';
import {DTOCoursTickerAllege} from '../../../cours/dto-cours-ticker-allege.interface';

export class DonneesCoursVagues {
  valeur: DTOValeur;
  cours: DTOCoursTickerAllege[];
  nbVagues?: number;

  constructor(valeur: DTOValeur, cours: DTOCoursTickerAllege[]) {
    this.valeur = valeur;
    this.cours = cours;
  }
}
