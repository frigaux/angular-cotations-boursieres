import {Injectable} from '@angular/core';
import {DTOPortefeuille} from './dto-portefeuille.interface';
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

  private cleMessageErreur: string | undefined;

  constructor(private translateService: TranslateService) {
  }

  public charger(): Array<DTOPortefeuille> {
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

  public enregistrer(portefeuilles: Array<DTOPortefeuille>): void {
    if (this.validerPortefeuilles(portefeuilles)) {
      window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, JSON.stringify(portefeuilles));
      PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
    }
  }

  public export(): string {
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

  public import(json: string): string | undefined {
    try {
      const portefeuilles: any = JSON.parse(json);
      if (this.validerPortefeuilles(portefeuilles)) {
        window.localStorage.setItem(PortefeuillesService.PORTEFEUILLES, json);
        PortefeuillesService.OBSERVERS_IMPORT.forEach(observer => observer.next(portefeuilles));
        PortefeuillesService.OBSERVERS_UPDATE.forEach(observer => observer.next(portefeuilles));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public onImport(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_IMPORT.subscribe(handler);
  }

  /**
   * Enregistrements et imports.
   * @param handler lambda avec les portefeuilles en paramètre
   */
  public onUpdate(handler: ((value: Array<DTOPortefeuille>) => void)): void {
    PortefeuillesService.OBSERVABLE_UPDATE.subscribe(handler);
  }

  private validerPortefeuilles(portefeuilles: any): boolean {
    this.cleMessageErreur = undefined;
    if (portefeuilles instanceof Array) {
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('nom'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.NOM_REQUIS';
        return false;
      }
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('parDefaut'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.PAR_DEFAUT_REQUIS';
        return false;
      }
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('tickers'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.TICKERS_REQUIS';
        return false;
      }
      if (portefeuilles.find(portefeuille =>
        !portefeuille.hasOwnProperty('alertes'))) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.ALERTES_REQUIS';
        return false;
      }
      if (portefeuilles.length > 0
        && portefeuilles.filter(portefeuille => portefeuille.parDefaut).length !== 1) {
        this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.UN_SEUL_PAR_DEFAUT';
        return false;
      }
    } else {
      this.cleMessageErreur = 'SERVICES.PORTEFEUILLES.ERREURS.TABLEAU_REQUIS';
      return false;
    }
    return true;
  }

  public auMoinsUnPortefeuilleCorrectementConfigure(): boolean {
    const portefeuilleParDefaut: DTOPortefeuille | undefined = this.charger()
      .find(portefeuille => portefeuille.parDefaut);
    return portefeuilleParDefaut !== undefined && portefeuilleParDefaut.tickers.length > 0;
  }
}
