import {Injectable} from '@angular/core';
import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';
import {Observable, Subscriber} from 'rxjs';

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

  charger(): Array<DTOPortefeuille> {
    const json = window.localStorage.getItem(PortefeuillesService.PORTEFEUILLES);
    if (json) {
      try {
        return JSON.parse(json);
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
    return window.localStorage.getItem(PortefeuillesService.PORTEFEUILLES) || '[]';
  }

  import(json: string): boolean {
    try {
      const portefeuilles: any = JSON.parse(json);
      if (portefeuilles instanceof Array) {
        const error = portefeuilles.find(portefeuille =>
          !portefeuille.hasOwnProperty('nom')
          || !portefeuille.hasOwnProperty('parDefaut')
          || !portefeuille.hasOwnProperty('tickers')
          || !portefeuille.hasOwnProperty('alertes'));
        if (!error) {
          window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, json);
          PortefeuillesService.OBSERVERS_IMPORT.forEach(observer => observer.next(portefeuilles));
          PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
          return true;
        }
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  onImport(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_IMPORT.subscribe(handler);
  }

  /**
   * Enregistrements et imports.
   * @param handler lambda avec les portefeuilles en paramètre
   */
  onUpdate(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_UPDATE.subscribe(handler);
  }
}
