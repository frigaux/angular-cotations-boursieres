import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {AchatDecore} from '../valeurs/details-valeur/achats-valeur/achat-decore.class';
import {DTOAchatsTicker} from '../../services/valeurs/dto-achats-ticker.interface';

export class AchatsValeurDecores {
  id: number;
  valeur: DTOValeur;
  achatsTicker: DTOAchatsTicker;
  achatsDecores: Array<AchatDecore>;

  constructor(id: number, valeur: DTOValeur, achatsTicker: DTOAchatsTicker, achatsDecores: Array<AchatDecore>) {
    this.id = id;
    this.valeur = valeur;
    this.achatsTicker = achatsTicker;
    this.achatsDecores = achatsDecores;
  }
}
