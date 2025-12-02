import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';
import {EtapeValeur} from './etape-valeur.enum';

export class EtapeValeurUtil {
  static isOrdreAchat(achat: DTOAchat): boolean {
    return achat.prix !== undefined && achat.quantite !== undefined && achat.date === undefined;
  }

  static isAchat(achat: DTOAchat): boolean {
    return achat.date !== undefined && achat.dateRevente === undefined;
  }

  static isOrdreVente(achat: DTOAchat): boolean {
    return achat.prixRevente !== undefined && achat.dateRevente === undefined;
  }

  static isVente(achat: DTOAchat): boolean {
    return achat.dateRevente !== undefined;
  }

  static etapeValeur(achat: DTOAchat): EtapeValeur {
    if (achat.prix !== undefined && achat.quantite !== undefined) {
      if (achat.date === undefined) {
        return EtapeValeur.ORDRE_ACHAT;
      } else {
        if (achat.prixRevente === undefined) {
          return EtapeValeur.ACHAT;
        } else {
          if (achat.dateRevente === undefined) {
            return EtapeValeur.ORDRE_VENTE;
          } else {
            return EtapeValeur.VENTE;
          }
        }
      }
    }
    return EtapeValeur.ORDRE_ACHAT;
  }
}
