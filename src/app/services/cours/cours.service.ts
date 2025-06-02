import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOListeCours} from './dto-liste-cours.interface';
import {DTOCoursTicker} from './dto-cours-ticker.interface';
import {DTOCoursTickerAllege} from './dto-cours-ticker-allege.interface';
import {DtoCoursAvecListeAllege} from './dto-cours-avec-liste-allege.interface';

@Injectable({
  providedIn: 'root'
})
export class CoursService {

  constructor(private http: HttpClient) {
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

  public chargerCoursTickersWithLimit(tickers: Array<string>, limit: number): Observable<DtoCoursAvecListeAllege[]> {
    const liste: string = tickers.reduce((t1, t2) => t1 + ',' + t2);
    return this.http.get<DtoCoursAvecListeAllege[]>(
      `bourse/cours/tickers/${limit}?tickers=${liste}`
    );
  }
}
