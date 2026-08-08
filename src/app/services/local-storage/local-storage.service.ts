import {Injectable} from '@angular/core';
import {LocalStorable} from './local-storable.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public static readonly REPLACER = (key: string, value: any) => Number.isNaN(value) ? "NaN" : value;

  public enregistrerDTO(ticker: string, dto: any) {
    type LocalStorableStrings = keyof typeof LocalStorable;
    const nom: LocalStorableStrings = dto.constructor.name;
    const json = window.localStorage.getItem(LocalStorable[nom]) || '{}';
    try {
      const dtoByTicker: any = JSON.parse(json);
      dtoByTicker[ticker] = dto;
      window.localStorage.setItem(LocalStorable[nom], JSON.stringify(dtoByTicker, LocalStorageService.REPLACER));
    } catch (e) {
      console.error(e);
    }
  }

  public enregistrerDTOByTicker(cle: LocalStorable, json: any): any {
    window.localStorage.setItem(cle, JSON.stringify(json, LocalStorageService.REPLACER));
  }

  public chargerDTO(ticker: string, cle: LocalStorable): any | undefined {
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
