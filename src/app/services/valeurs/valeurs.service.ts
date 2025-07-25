import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DTOValeur} from './dto-valeur.interface';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AchatsTicker} from './achats-ticker.interface';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {
  private static readonly ACHATS: string = 'achats';

  private cleMessageErreur: string | undefined;

  constructor(private http: HttpClient,
              private translateService: TranslateService) {
  }

  public chargerValeurs(): Observable<DTOValeur[]> {
    return this.http.get<DTOValeur[]>(
      'bourse/valeurs'
    );
  }

  public static reviverAchatsTicker(this: any, key: string, value: any): any {
    return key === 'date' ? new Date(value) : value;
  };

  public chargerAchats(): Array<AchatsTicker> {
    const json = window.localStorage.getItem(ValeursService.ACHATS);
    if (json) {
      try {
        const achatsTicker: any = JSON.parse(json, ValeursService.reviverAchatsTicker);
        if (this.validerAchats(achatsTicker)) {
          return achatsTicker;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }

  public enregistrerAchats(achatsTickers: Array<AchatsTicker>): string | undefined {
    if (this.validerAchats(achatsTickers)) {
      window.localStorage.setItem(ValeursService.ACHATS, JSON.stringify(achatsTickers));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public importAchats(json: string): string | undefined {
    try {
      const achatsTickers: any = JSON.parse(json, ValeursService.reviverAchatsTicker);
      if (this.validerAchats(achatsTickers)) {
        window.localStorage.setItem(ValeursService.ACHATS, JSON.stringify(achatsTickers));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  private validerAchats(achatsTickers: Array<AchatsTicker>): boolean {
    this.cleMessageErreur = undefined;
    for (const achatsTicker of achatsTickers) {
      if (typeof achatsTicker.ticker !== 'string') {
        this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.TICKER_REQUIS';
        return false;
      }
      if (!(achatsTicker.achats instanceof Array)) {
        this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHATS_REQUIS';
        return false;
      }
      for (const achat of achatsTicker.achats) {
        if (!(achat.date instanceof Date)) {
          this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.DATE_REQUIS';
          return false;
        }
        if (typeof achat.quantite !== 'number') {
          this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.QUANTITE_REQUISE';
          return false;
        }
        if (typeof achat.prix !== 'number') {
          this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.PRIX_REQUIS';
          return false;
        }
        if (typeof achat.revendu !== 'boolean') {
          this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.REVENDU_REQUIS';
          return false;
        }
      }
    }
    return true;
  }
}
