import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subscriber} from 'rxjs';
import {DTOListeCours} from './dto-liste-cours.interface';
import {DTOCoursTicker} from './dto-cours-ticker.interface';
import {DTOCoursTickerAllege} from './dto-cours-ticker-allege.interface';
import {DTOCoursAvecListeAllege} from './dto-cours-avec-liste-allege.interface';
import {TranslateService} from '@ngx-translate/core';
import {DTOFiltre} from './dto-filtre.interface';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private static readonly FILTRES: string = 'filtres';
  private static readonly OBSERVERS_IMPORT_FILTRES: Array<Subscriber<Array<DTOFiltre>>> = [];
  private static readonly OBSERVERS_UPDATE_FILTRES: Array<Subscriber<Array<DTOFiltre>>> = [];
  private static readonly OBSERVABLE_IMPORT_FILTRES: Observable<Array<DTOFiltre>> = new Observable(observer => {
    CoursService.OBSERVERS_IMPORT_FILTRES.push(observer);
  });
  private static readonly OBSERVABLE_UPDATE_FILTRES: Observable<Array<DTOFiltre>> = new Observable(observer => {
    CoursService.OBSERVERS_UPDATE_FILTRES.push(observer);
  });

  private cleMessageErreur: string | undefined;

  public static readonly CONFIGURATION_INITIALE_FILTRE = [
    {
      nom:'Creux vague',
      condition: 'M100 < M50 && M50 > M25 && M25 > M10 && M10 > M5 && M5 > M4 && M2 < (0.995 * M1)'
    },
    {
      nom:'Remontée',
      condition: 'M100 > M50 && M50 > M25 && M25 > M10 && M10 > M5 && M5 > M4 && M2 < (0.995 * M1)'
    },
    {
      nom:'Sommet vague',
      condition: 'M100 > M50 && M50 < M25 && M25 < M10 && M10 < M5 && M5 < M4 && M2 > (1.005 * M1)'
    },
    {
      nom:'Chute',
      condition: 'M100 < M50 && M50 < M25 && M25 < M10 && M10 < M5 && M5 < M4 && M2 > (1.005 * M1)'
    }
  ];

  constructor(private http: HttpClient,
              private translateService: TranslateService) {
  }

  public chargerCours(): Observable<DTOListeCours> {
    return this.http.get<DTOListeCours>(
      '/bourse/cours'
    );
  }

  public chargerCoursTicker(ticker: string): Observable<DTOCoursTicker> {
    return this.http.get<DTOCoursTicker>(
      `/bourse/cours/${ticker}`
    );
  }

  public chargerCoursTickerWithLimit(ticker: string, limit: number): Observable<DTOCoursTickerAllege[]> {
    return this.http.get<DTOCoursTickerAllege[]>(
      `/bourse/cours/${ticker}/${limit}`
    );
  }

  public chargerCoursTickersWithLimit(tickers: Array<string>, limit: number): Observable<DTOCoursAvecListeAllege[]> {
    if (tickers.length > 0) {
      const liste: string = tickers.reduce((t1, t2) => t1 + ',' + t2);
      return this.http.get<DTOCoursAvecListeAllege[]>(
        `/bourse/cours/tickers/${limit}?tickers=${liste}`
      );
    } else {
      return of([]);
    }
  }

  public chargerFiltres(): Array<DTOFiltre> {
    const json = window.localStorage.getItem(CoursService.FILTRES);
    if (json) {
      try {
        const filtres: any = JSON.parse(json);
        if (this.validerFiltres(filtres)) {
          return filtres;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  }

  public enregistrerFiltres(filtres: Array<DTOFiltre>): string | undefined {
    if (this.validerFiltres(filtres)) {
      window.localStorage.setItem(CoursService.FILTRES, JSON.stringify(filtres));
      CoursService.OBSERVERS_UPDATE_FILTRES.forEach(observer => observer.next(filtres));
      return undefined;
    } else {
      return this.translateService.instant(this.cleMessageErreur!);
    }
  }

  public importFiltres(json: string): string | undefined {
    try {
      const filtres: any = JSON.parse(json);
      if (this.validerFiltres(filtres)) {
        window.localStorage.setItem(CoursService.FILTRES, JSON.stringify(filtres));
        CoursService.OBSERVERS_IMPORT_FILTRES.forEach(observer => observer.next(filtres));
        return undefined;
      } else {
        return this.translateService.instant(this.cleMessageErreur!);
      }
    } catch (e) { // JSON mal formé
      return (e as SyntaxError).message;
    }
  }

  public onImportFiltres(handler: ((value: Array<DTOFiltre>) => void)): void {
    CoursService.OBSERVABLE_IMPORT_FILTRES.subscribe(handler);
  }

  public onUpdateFiltres(handler: ((value: Array<DTOFiltre>) => void)): void {
    CoursService.OBSERVABLE_UPDATE_FILTRES.subscribe(handler);
  }

  private validerFiltres(filtres: any): boolean {
    this.cleMessageErreur = undefined;
    if (filtres instanceof Array) {
      for (const filtre of filtres) {
        if (!filtre.hasOwnProperty('nom') || filtre.nom.length === 0) {
          this.cleMessageErreur = 'SERVICES.COURS.ERREURS.FILTRES.NOM_REQUIS';
          return false;
        }
        if (!filtre.hasOwnProperty('condition') || filtre.condition.length === 0) {
          this.cleMessageErreur = 'SERVICES.COURS.ERREURS.FILTRES.CONDITION_REQUISE';
          return false;
        }
        if (this.validerCondition(filtre.condition) !== undefined) {
          this.cleMessageErreur = 'SERVICES.COURS.ERREURS.FILTRES.CONDITION_INVALIDE';
          return false;
        }
      }
    } else {
      this.cleMessageErreur = 'SERVICES.COURS.ERREURS.FILTRES.FILTRES_REQUIS';
      return false;
    }
    return true;
  }

  public validerCondition(condition: string): string | undefined {
    const conditionAvecSubstitution = condition
      .replaceAll(/M(\d+)/gi, (match, token) => {
        return `M[${token - 1}]`;
      });
    try {
      new Function(
        'const M = Array.from({ length: 300 }, (v, i) => i);'
        + 'return ' + conditionAvecSubstitution + ';'
      );
    } catch (e: unknown) {
      return (e as SyntaxError).message;
    }
    return undefined;
  }
}
