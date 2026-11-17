import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOCotations} from './dto-cotations.interface';
import {DTOCotationsBourseDirect} from './dto-cotations-bourse-direct';
import {DtoCurrentBourseDirect} from './dto-current-bourse-direct';
import {DTOCours} from './dto-cours.interface';

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
            const date = last.Date;
            const {plusBas, plusHaut, volume, nbEchanges} = this.calculerCotations(dto);
            observer.next({
              date,
              ticker,
              cours: last.ClosePrice,
              derniereCloture: dto.previous.ClosePrice,
              ouverture: first.OpenPrice,
              plusBas,
              plusHaut,
              volume,
              nbEchanges,
              jour: this.coursDuJour(dto)
            });
          } else {
            observer.error();
          }
          observer.complete();
        }
      });
    });
  }

  private coursDuJour(dto: DTOCotationsBourseDirect): DTOCours[] {
    return dto.current.map(current => {
      return {
        date: current.Date,
        cours: current.ClosePrice,
        volume: current.Volume,
        nbEchanges: current.TradeCount
      };
    });
  }

  private calculerCotations(dto: DTOCotationsBourseDirect) {
    let plusBas: number = NaN;
    let plusHaut: number = NaN;
    let volume: number = 0;
    let nbEchanges: number = 0;
    dto.current.forEach(current => {
      if (!plusBas || plusBas > current.Low) {
        plusBas = current.Low;
      }
      if (!plusHaut || plusHaut < current.High) {
        plusHaut = current.High;
      }
      volume += current.Volume;
      nbEchanges += current.TradeCount;
    });
    return {plusBas, plusHaut, volume, nbEchanges};
  }
}
