import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOListeCours} from './dto-liste-cours.interface';
import {DTOCoursTicker} from './dto-cours-ticker.interface';
import {DTOCoursTickerLight} from './dto-cours-ticker-light.interface';

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

  public chargerCoursTickerWithLimit(ticker: string, limit: number): Observable<DTOCoursTickerLight[]> {
    return this.http.get<DTOCoursTickerLight[]>(
      `bourse/cours/${ticker}/${limit}`
    );
  }
}
