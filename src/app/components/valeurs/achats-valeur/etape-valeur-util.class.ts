import {DTOAchat} from '../../../services/valeurs/dto-achat.interface';
import {EtapeValeur} from './etape-valeur.enum';
import {DTOAchatsTicker} from '../../../services/valeurs/dto-achats-ticker.interface';

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

  static filtrerParEtape(achats: Array<DTOAchatsTicker>, etape: EtapeValeur): Array<DTOAchatsTicker> {
    return achats
      .map(achatsTicker => {
          return {
            ticker: achatsTicker.ticker,
            achats: achatsTicker.achats
              .filter(achat => {
                switch (etape) {
                  case EtapeValeur.ORDRE_ACHAT:
                    return EtapeValeurUtil.isOrdreAchat(achat);
                  case EtapeValeur.ACHAT:
                    return EtapeValeurUtil.isAchat(achat);
                  case EtapeValeur.ORDRE_VENTE:
                    return EtapeValeurUtil.isOrdreVente(achat);
                  case EtapeValeur.VENTE:
                    return EtapeValeurUtil.isVente(achat);
                }
              })
          };
        }
      )
      .filter(achatsTicker => achatsTicker.achats.length > 0);
  }
}
