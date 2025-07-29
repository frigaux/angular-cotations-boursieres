import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AchatDecore} from '../valeurs/details-valeur/achats-valeur/achat-decore.class';

export class AchatsValeurDecores {
  id: number;
  valeur: DTOValeur;
  achatsDecores: Array<AchatDecore>;

  constructor(id: number, valeur: DTOValeur, achatsDecores: Array<AchatDecore>) {
    this.id = id;
    this.valeur = valeur;
    this.achatsDecores = achatsDecores;
  }
}
