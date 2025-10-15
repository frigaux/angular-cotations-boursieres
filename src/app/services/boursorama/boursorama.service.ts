import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {DTOCours} from '../cours/dto-cours.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DtoCoursBoursorama} from './dto-cours-boursorama.interface';

@Injectable({
  providedIn: 'root'
})
export class BoursoramaService {
  private static readonly HEADERS = new HttpHeaders()
    .set('Accept', 'application/json');

  constructor(private http: HttpClient) {
  }

  public recupererCours(tickers: Array<string>): Observable<Array<DTOCours>> {
    return new Observable(observer => {
      forkJoin(tickers.map(ticker =>
        this.http.get<DtoCoursBoursorama>(`/boursorama/bourse/action/graph/ws/UpdateCharts?symbol=1rP${ticker}&period=-1`, {headers: BoursoramaService.HEADERS})
      )).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: objects => {
          const result: Array<DTOCours> = [];
          objects.forEach((cours: DtoCoursBoursorama, i: number) => {
            result.push({
              ticker: tickers[i],
              ouverture: cours.d[0].o,
              plusHaut: cours.d[0].h,
              plusBas: cours.d[0].l,
              cloture: cours.d[0].c,
              volume: cours.d[0].v,
              moyennesMobiles: []
            });
          });
          observer.next(result);
          observer.complete();
        }
      });
    });
  }
}
