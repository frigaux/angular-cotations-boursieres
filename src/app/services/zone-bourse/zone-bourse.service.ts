import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DTOActualitesZoneBourse} from './dto-actualites-zone-bourse.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZoneBourseService {
  private static readonly HEADERS_HTML = new HttpHeaders()
    .set('Accept', 'text/html');

  constructor(private http: HttpClient) {
  }

  public chargerActualites(): Observable<Array<DTOActualitesZoneBourse>> {
    return new Observable(observer => {
      this.http.get('/zonebourse/actualite-bourse/regions/locales/', {
        headers: ZoneBourseService.HEADERS_HTML,
        responseType: 'text'
      }).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: html => {
          const dto = this.parseAndMapActualites(html);
          if (dto) {
            observer.next(dto);
          } else {
            observer.error({
              message: 'Impossible de récupérer les actualités dans le html',
              html: html
            })
          }
          observer.complete();
        }
      });
    });
  }

  private parseAndMapActualites(html: string): Array<DTOActualitesZoneBourse> | undefined {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const elTBody = document.querySelector('#newsScreener > tbody');
    if (elTBody) {
      const elTRs = elTBody.querySelectorAll('tr');
      const resultat: Array<DTOActualitesZoneBourse> = [];
      elTRs.forEach(elTR => {
        const elAs = elTR.querySelectorAll('a');
        const elSpanTicker = elTR.querySelector('span.txt-s1');
        const elSpanDate = elTR.querySelector('span.js-date-relative');
        if (elAs.length === 2 && elSpanTicker && elSpanDate) {
          const date = elSpanDate.innerHTML.trim();
          const ticker = elSpanTicker.innerHTML.trim();
          const titre = elAs[0].innerText.trim();
          const pathname = elAs[0].pathname;
          resultat.push({date, ticker, titre, pathname});
        }
      });
      return resultat;
    }
    return undefined;
  }
}
