import {DTOValeur} from '../../../services/valeurs/dto-valeur.interface';
import {AchatDecore} from '../../valeurs/achats-valeur/achat-decore.class';
import {DTODividende} from '../../../services/dividendes/dto-dividende.interface';

export class AchatValeurDecore {
  valeur: DTOValeur;
  achatDecore: AchatDecore;
  dividendes?: Array<DTODividende>;

  constructor(valeur: DTOValeur, achatDecore: AchatDecore) {
    this.valeur = valeur;
    this.achatDecore = achatDecore;
  }
}
