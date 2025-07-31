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

  constructor(private http: HttpClient,
              private translateService: TranslateService) {
  }

  public chargerCours(): Observable<DTOListeCours> {
    return this.http.get<DTOListeCours>(
      'bourse/cours'
    );
  }

  public chargerCoursTicker(ticker: string): Observable<DTOCoursTicker> {
    return this.http.get<DTOCoursTicker>(
      `bourse/cours/${ticker}`
    );
  }

  public chargerCoursTickerWithLimit(ticker: string, limit: number): Observable<DTOCoursTickerAllege[]> {
    return this.http.get<DTOCoursTickerAllege[]>(
      `bourse/cours/${ticker}/${limit}`
    );
  }

  public chargerCoursTickersWithLimit(tickers: Array<string>, limit: number): Observable<DTOCoursAvecListeAllege[]> {
    if (tickers.length > 0) {
      const liste: string = tickers.reduce((t1, t2) => t1 + ',' + t2);
      return this.http.get<DTOCoursAvecListeAllege[]>(
        `bourse/cours/tickers/${limit}?tickers=${liste}`
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

  private validerFiltres(filtress: Array<DTOFiltre>): boolean {
    this.cleMessageErreur = undefined;
    return true;
  }

}
