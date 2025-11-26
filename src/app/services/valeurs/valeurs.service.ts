import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DTOValeur} from './dto-valeur.interface';
import {Observable, Subscriber} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DTOAchatsTicker} from './dto-achats-ticker.interface';
import {DTOAchat} from './dto-achat.interface';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {
  private static readonly ACHATS: string = 'achats';
  private static readonly OBSERVERS_IMPORT_ACHATS: Array<Subscriber<Array<DTOAchatsTicker>>> = [];
  private static readonly OBSERVERS_UPDATE_ACHATS: Array<Subscriber<Array<DTOAchatsTicker>>> = [];
  private static readonly OBSERVABLE_IMPORT_ACHATS: Observable<Array<DTOAchatsTicker>> = new Observable(observer => {
    ValeursService.OBSERVERS_IMPORT_ACHATS.push(observer);
  });
  private static readonly OBSERVABLE_UPDATE_ACHATS: Observable<Array<DTOAchatsTicker>> = new Observable(observer => {
    ValeursService.OBSERVERS_UPDATE_ACHATS.push(observer);
  });

  private cleMessageErreur: string | undefined;

  constructor(private http: HttpClient,
              private translateService: TranslateService) {
  }

  public chargerValeurs(): Observable<DTOValeur[]> {
    return this.http.get<DTOValeur[]>(
      '/bourse/valeurs'
    );
  }

  public chargerAchats(): Array<DTOAchatsTicker> {
    const json = window.localStorage.getItem(ValeursService.ACHATS);
    if (json) {
      try {
        const achatsTickers: Array<DTOAchatsTicker> = JSON.parse(json);
        if (this.validerAchatsTickers(achatsTickers)) {
          return achatsTickers;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }

  chargerAchatsByTicker(): Map<string, Array<DTOAchat>> {
    const achatsByTicker = new Map<string, Array<DTOAchat>>();
    for (const achat of this.chargerAchats()) {
      achatsByTicker.set(achat.ticker, achat.achats);
    }
    return achatsByTicker;
  }

  public chargerAchatsTicker(ticker: string): Array<DTOAchat> {
    const achatsTicker: DTOAchatsTicker | undefined = this.chargerAchats()
      .find(achats => achats.ticker === ticker);
    return achatsTicker?.achats || [];
  }

  public enregistrerAchats(achatsTickers: Array<DTOAchatsTicker>): string | undefined {
    if (this.validerAchatsTickers(achatsTickers)) {
      achatsTickers = this.filtrerTickerSansAchat(achatsTickers);
      window.localStorage.setItem(ValeursService.ACHATS, JSON.stringify(achatsTickers));
      ValeursService.OBSERVERS_UPDATE_ACHATS.forEach(observer => observer.next(achatsTickers));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public enregistrerAchatsTicker(ticker: string, achats: Array<DTOAchat>): string | undefined {
    if (this.validerAchats(achats)) {
      const achatsTickers = this.chargerAchats();
      const achatsTicker: DTOAchatsTicker | undefined = achatsTickers
        .find(achats => achats.ticker === ticker);
      if (achatsTicker) {
        achatsTicker.achats = achats;
      } else {
        achatsTickers.push({
          ticker: ticker,
          achats: achats
        })
      }
      return this.enregistrerAchats(achatsTickers);
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public onUpdateAchats(handler: ((value: Array<DTOAchatsTicker>) => void)): void {
    ValeursService.OBSERVABLE_UPDATE_ACHATS.subscribe(handler);
  }

  public importAchats(json: string): string | undefined {
    try {
      let achatsTickers: any = JSON.parse(json);
      if (this.validerAchatsTickers(achatsTickers)) {
        achatsTickers = this.filtrerTickerSansAchat(achatsTickers);
        window.localStorage.setItem(ValeursService.ACHATS, JSON.stringify(achatsTickers));
        ValeursService.OBSERVERS_IMPORT_ACHATS.forEach(observer => observer.next(achatsTickers));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public onImportAchats(handler: ((value: Array<DTOAchatsTicker>) => void)): void {
    ValeursService.OBSERVABLE_IMPORT_ACHATS.subscribe(handler);
  }

  private validerAchatsTickers(achatsTickers: Array<DTOAchatsTicker>): boolean {
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
      if (!this.validerAchats(achatsTicker.achats)) {
        return false;
      }
    }
    return true;
  }

  private validerAchats(achats: Array<DTOAchat>): boolean {
    for (const achat of achats) {
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
      if (achat.dateRevente !== undefined && isNaN(Date.parse(achat.dateRevente))) {
        this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.DATE_REVENTE_REQUISE';
        return false;
      }
      if ((achat.dateRevente === undefined && typeof achat.prixRevente === 'number')
        || (achat.dateRevente !== undefined && typeof achat.prixRevente !== 'number')) {
        this.cleMessageErreur = 'SERVICES.VALEURS.ERREURS.ACHATS.ACHAT.INCOHERENCE_REVENTE';
        return false;
      }
    }
    return true;
  }

  private filtrerTickerSansAchat(achatsTickers: Array<DTOAchatsTicker>): Array<DTOAchatsTicker> {
    return achatsTickers.filter(achatsTicker => achatsTicker.achats.length !== 0);
  }
}
