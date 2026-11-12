import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {DTOCotations} from './dto-cotations.interface';
import {ParseUtil} from '../commun/parse-util.class';

@Injectable({
  providedIn: 'root',
})
export class YahooService {
  constructor(private http: HttpClient) {
  }

  public chargerCotationsTickers(tickers: Array<string>): Observable<Array<DTOCotations>> {
    return new Observable(observer => {
      forkJoin(tickers.map(ticker =>
        this.http.get(`/yahoo/quote/${ticker}.PA/`, {
          responseType: 'text'
        })
      )).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: htmls => {
          const resultat = htmls.map(
            (html: string, i: number) => this.parseHtml(tickers[i], html)
          ).filter(dto => dto !== undefined);
          observer.next(resultat);
          observer.complete();
        }
      });
    });
  }

  private parseHtml(ticker: string, html: string): DTOCotations | undefined {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const elSpanPrix = document.querySelector('div.price span.price');
    const elLIsCotations = document.querySelectorAll('section.quote-statistics-container ul li');
    const elFinVariations = elLIsCotations.item(4).querySelector('fin-streamer');


    if (elSpanPrix && elFinVariations && elLIsCotations.length === 16) {
      const variations = elFinVariations.innerHTML.split('-');
      return {
        ticker,
        cours: ParseUtil.parseNumber(elSpanPrix.innerHTML),
        derniereCloture: ParseUtil.queryAndParseNumber(elLIsCotations.item(0), 'fin-streamer'),
        ouverture: ParseUtil.queryAndParseNumber(elLIsCotations.item(1), 'fin-streamer'),
        plusBas: ParseUtil.parseNumber(variations[0]),
        plusHaut: ParseUtil.parseNumber(variations[1]),
        volume: ParseUtil.queryAndParseNumber(elLIsCotations.item(6), 'fin-streamer')
      };
    } else {
      console.error('Impossible de récupérer les cotations', document);
      return undefined;
    }
  }
}
