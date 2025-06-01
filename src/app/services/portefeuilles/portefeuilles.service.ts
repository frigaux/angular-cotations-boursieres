import {Injectable} from '@angular/core';
import {Portefeuille} from '../../components/portefeuilles/gestion-portefeuilles/portefeuille.interface';
import {Observable, Subscriber} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortefeuillesService {
  private static readonly PORTEFEUILLES: string = 'portefeuilles';
  private static readonly OBSERVERS_IMPORT: Array<Subscriber<Array<Portefeuille>>> = [];
  private static readonly OBSERVABLE_IMPORT: Observable<Array<Portefeuille>> = new Observable(observer => {
    PortefeuillesService.OBSERVERS_IMPORT.push(observer);
  });

  charger(): Array<Portefeuille> {
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

  enregistrer(portefeuilles: Array<Portefeuille>): void {
    window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, JSON.stringify(portefeuilles));
  }

  export(): string {
    return window.localStorage.getItem(PortefeuillesService.PORTEFEUILLES) || '[]';
  }

  import(json: string): void {
    try {
      const portefeuilles: any = JSON.parse(json);
      if (portefeuilles instanceof Array) {
        const error = portefeuilles.find(portefeuille =>
          !portefeuille.hasOwnProperty('nom')
          || !portefeuille.hasOwnProperty('tickers'));
        if (!error) {
          window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, json);
          PortefeuillesService.OBSERVERS_IMPORT.forEach(observer => observer.next(portefeuilles));
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  onImport(o: ((value: Array<Portefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_IMPORT.subscribe(o);
  }
}
