import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOCotations} from './dto-cotations.interface';
import {DTOCotationsBourseDirect} from './dto-cotations-bourse-direct';
import {DtoCurrentBourseDirect} from './dto-current-bourse-direct';

@Injectable({
  providedIn: 'root',
})
export class BourseDirectService {
  private static readonly HEADERS_JSON = new HttpHeaders()
    .set('Accept', 'application/json');

  constructor(private http: HttpClient) {
  }

  public chargerCotationsTicker(ticker: string): Observable<DTOCotations> {
    return new Observable(observer => {
      this.http.get<DTOCotationsBourseDirect>(`/boursedirect/api/instrument/intraday/XPAR/${ticker}/EUR`,
        {headers: BourseDirectService.HEADERS_JSON}).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: dto => {
          if (dto.current.length > 0) {
            const first: DtoCurrentBourseDirect = dto.current[0];
            const last: DtoCurrentBourseDirect = dto.current[dto.current.length - 1];
            let plusBas: number = NaN;
            let plusHaut: number = NaN;
            let volume: number = 0;
            dto.current.forEach(current => {
              if (!plusBas || plusBas > current.Low) {
                plusBas = current.Low;
              }
              if (!plusHaut || plusHaut < current.High) {
                plusHaut = current.High;
              }
              volume += current.Volume;
            });
            observer.next({
              ticker,
              cours: last.ClosePrice,
              derniereCloture: dto.previous.ClosePrice,
              ouverture: first.OpenPrice,
              plusBas,
              plusHaut,
              volume
            });
          } else {
            observer.error();
          }
          observer.complete();
        }
      });
    });
  }
}
