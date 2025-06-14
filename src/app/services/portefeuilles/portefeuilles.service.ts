import {Injectable} from '@angular/core';
import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';
import {Observable, Subscriber} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PortefeuillesService {
  private static readonly PORTEFEUILLES: string = 'portefeuilles';
  private static readonly OBSERVERS_IMPORT: Array<Subscriber<Array<DTOPortefeuille>>> = [];
  private static readonly OBSERVERS_UPDATE: Array<Subscriber<Array<DTOPortefeuille>>> = [];
  private static readonly OBSERVABLE_IMPORT: Observable<Array<DTOPortefeuille>> = new Observable(observer => {
    PortefeuillesService.OBSERVERS_IMPORT.push(observer);
  });
  private static readonly OBSERVABLE_UPDATE: Observable<Array<DTOPortefeuille>> = new Observable(observer => {
    PortefeuillesService.OBSERVERS_UPDATE.push(observer);
  });

  constructor(private translateService: TranslateService) {

  }

  charger(): Array<DTOPortefeuille> {
    const json = window.localStorage.getItem(PortefeuillesService.PORTEFEUILLES);
    if (json) {
      try {
        const portefeuilles: any = JSON.parse(json);
        if (this.validerPortefeuilles(portefeuilles)) {
          return portefeuilles;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }

  enregistrer(portefeuilles: Array<DTOPortefeuille>): void {
    window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, JSON.stringify(portefeuilles));
    PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
  }

  export(): string {
    const json = window.localStorage.getItem(PortefeuillesService.PORTEFEUILLES);
    if (json) {
      try {
        const portefeuilles: any = JSON.parse(json);
        if (this.validerPortefeuilles(portefeuilles)) {
          return json;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return '[]';
  }

  import(json: string): string | undefined {
    try {
      const portefeuilles: any = JSON.parse(json);
      if (this.validerPortefeuilles(portefeuilles)) {
        window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, json);
        PortefeuillesService.OBSERVERS_IMPORT.forEach(observer => observer.next(portefeuilles));
        PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
        return undefined;
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
    return this.translateService.instant('SERVICES.PORTEFEUILLES.PORTEFEUILLES_INVALIDES');
  }

  onImport(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_IMPORT.subscribe(handler);
  }

  validerPortefeuilles(portefeuilles: any): boolean {
    if (portefeuilles instanceof Array) {
      const error = portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('nom')
        || !portefeuille.hasOwnProperty('parDefaut')
        || !portefeuille.hasOwnProperty('tickers')
        || !portefeuille.hasOwnProperty('alertes'));
      return error === undefined;
    }
    return false;
  }

  /**
   * Enregistrements et imports.
   * @param handler lambda avec les portefeuilles en paramètre
   */
  onUpdate(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_UPDATE.subscribe(handler);
  }
}
