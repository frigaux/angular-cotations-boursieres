import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';
import {EtapeValeur} from './etape-valeur.enum';
import {EtapeValeurUtil} from './etape-valeur-util.class';
import {DTOCours} from '../../../services/cours/dto-cours.interface';

export class AchatDecore {
  id: number;
  form: { date?: Date, dateRevente?: Date, etape: EtapeValeur };
  achat: DTOAchat;
  cours?: number;
  dto?: DTOCours;
  variation?: number;

  constructor(id: number, achat: DTOAchat) {
    this.id = id;
    this.form = {
      date: achat.date ? new Date(achat.date) : undefined,
      dateRevente: achat.dateRevente ? new Date(achat.dateRevente) : undefined,
      etape: EtapeValeurUtil.etapeValeur(achat)
    };
    this.achat = achat;
  }
}
