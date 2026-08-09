import {Injectable} from '@angular/core';
import {LocalStorable} from './local-storable.enum';
import {Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public static readonly REPLACER = (key: string, value: any) => Number.isNaN(value) ? "NaN" : value;
  private readonly updateSubject = new Subject<any>();

  public enregistrerDTO(cle: LocalStorable, ticker: string, dto: any) {
    const json = window.localStorage.getItem(cle) || '{}';
    try {
      const dtoByTicker: any = JSON.parse(json);
      dtoByTicker[ticker] = dto;
      window.localStorage.setItem(cle, JSON.stringify(dtoByTicker, LocalStorageService.REPLACER));
      this.updateSubject.next({cle, dtoByTicker});
    } catch (e) {
      console.error(e);
    }
  }

  public enregistrerDTOByTicker(cle: LocalStorable, dtoByTicker: any): any {
    window.localStorage.setItem(cle, JSON.stringify(dtoByTicker, LocalStorageService.REPLACER));
    this.updateSubject.next({cle, dtoByTicker});
  }

  /**
   * Enregistrements et imports.
   * @param handler lambda avec les dto en paramètre
   */
  public onUpdate(handler: ((value: { cle: LocalStorable, dtoByTicker: any }) => void)): Subscription {
    return this.updateSubject.subscribe(handler);
  }

  public chargerDTO(cle: LocalStorable, ticker: string): any | undefined {
    const json = window.localStorage.getItem(cle) || '{}';
    try {
      const dtoByTicker: any = JSON.parse(json);
      if (dtoByTicker.hasOwnProperty(ticker)) {
        return dtoByTicker[ticker];
      }
    } catch (e) {
      console.error(e);
    }
    return undefined;
  }

  public chargerDTOByTicker(cle: LocalStorable): any {
    const json = window.localStorage.getItem(cle) || '{}';
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error(e);
    }
    return {};
  }
}
