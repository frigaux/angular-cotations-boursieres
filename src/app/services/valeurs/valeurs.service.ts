import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DTOValeur} from './dto-valeur.interface';
import {Observable, Subscriber} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AchatsTicker} from './achats-ticker.interface';
import {Achat} from './achat.interface';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {
  private static readonly ACHATS: string = 'achats';
  private static readonly OBSERVERS_IMPORT: Array<Subscriber<Array<AchatsTicker>>> = [];
  private static readonly OBSERVERS_UPDATE: Array<Subscriber<Array<AchatsTicker>>> = [];
  private static readonly OBSERVABLE_IMPORT: Observable<Array<AchatsTicker>> = new Observable(observer => {
    ValeursService.OBSERVERS_IMPORT.push(observer);
  });
  private static readonly OBSERVABLE_UPDATE: Observable<Array<AchatsTicker>> = new Observable(observer => {
    ValeursService.OBSERVERS_UPDATE.push(observer);
  });

  private cleMessageErreur: string | undefined;

  constructor(private http: HttpClient,
              private translateService: TranslateService) {
  }

  public chargerValeurs(): Observable<DTOValeur[]> {
    return this.http.get<DTOValeur[]>(
      'bourse/valeurs'
    );
  }

  public chargerAchats(): Array<AchatsTicker> {
    const json = window.localStorage.getItem(ValeursService.ACHATS);
    if (json) {
      try {
        const achatsTicker: any = JSON.parse(json);
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
      ValeursService.OBSERVERS_UPDATE.forEach(observer => observer.next(achatsTickers));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public importAchats(json: string): string | undefined {
    try {
      const achatsTickers: any = JSON.parse(json);
      if (this.validerAchats(achatsTickers)) {
        window.localStorage.setItem(ValeursService.ACHATS, JSON.stringify(achatsTickers));
        ValeursService.OBSERVERS_IMPORT.forEach(observer => observer.next(achatsTickers));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public onImport(handler: ((value: Array<AchatsTicker>) => void)): void {
    ValeursService.OBSERVABLE_IMPORT.subscribe(handler);
  }

  public chargerAchatsTicker(ticker: string): Array<Achat> {
    const json = window.localStorage.getItem(ValeursService.ACHATS);
    if (json) {
      try {
        const achatsTicker: any = JSON.parse(json);
        if (this.validerAchats(achatsTicker)) {
          const achatsTicker: AchatsTicker | undefined = this.chargerAchats()
            .find(achats => achats.ticker === ticker);
          return achatsTicker?.achats || [];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }

  public enregistrerAchatsTicker(ticker: string, achats: Array<Achat>): string | undefined {
    const achatsTickers = this.chargerAchats();
    const achatsTicker: AchatsTicker | undefined = achatsTickers
      .find(achats => achats.ticker === ticker);
    if (achatsTicker) {
      achatsTicker.achats = achats;
    } else {
      achatsTickers.push({
        ticker: ticker,
        achats: achats
      })
    }
    if (this.validerAchats(achatsTickers)) {
      window.localStorage.setItem(ValeursService.ACHATS, JSON.stringify(achatsTickers));
      ValeursService.OBSERVERS_UPDATE.forEach(observer => observer.next(achatsTickers));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public onUpdate(handler: ((value: Array<AchatsTicker>) => void)): void {
    ValeursService.OBSERVABLE_UPDATE.subscribe(handler);
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
        if (isNaN(Date.parse(achat.date))) {
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
