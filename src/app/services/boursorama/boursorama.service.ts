import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {DTOCours} from '../cours/dto-cours.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DTOCoursBoursorama} from './dto-cours-boursorama.interface';
import {DTOOrdre} from './dto-ordre.interface';
import {ParseUtil} from '../abc-bourse/parse-util.class';
import {DtoCotationsTickerBoursorama} from './dto-cotations-ticker-boursorama.interface';

@Injectable({
  providedIn: 'root'
})
export class BoursoramaService {
  private static readonly HEADERS_JSON = new HttpHeaders()
    .set('Accept', 'application/json');
  private static readonly HEADERS_HTML = new HttpHeaders()
    .set('Accept', 'text/html');

  constructor(private http: HttpClient) {
  }

  public chargerCoursTickers(tickers: Array<string>): Observable<Array<DTOCours>> {
    return new Observable(observer => {
      forkJoin(tickers.map(ticker =>
        this.http.get<DTOCoursBoursorama>(`/boursorama/bourse/action/graph/ws/UpdateCharts?symbol=1rP${ticker}&period=-1`,
          {headers: BoursoramaService.HEADERS_JSON})
      )).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: objects => {
          const result: Array<DTOCours> = [];
          objects.forEach((cours: DTOCoursBoursorama, i: number) => {
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

  public chargerCoursTicker(ticker: string): Observable<DtoCotationsTickerBoursorama> {
    return new Observable(observer => {
      this.http.get(`/boursorama/cours/1rP${ticker}/`, {
        headers: BoursoramaService.HEADERS_HTML,
        responseType: 'text'
      }).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: html => {
          const dto = this.parseAndMapCours(html);
          if (dto) {
            observer.next(dto);
          } else {
            observer.error({
              message: 'Impossible de récupérer les informations dans le html',
              html: html
            })
          }
          observer.complete();
        }
      });
    });
  }

  private parseAndMapCours(html: string): DtoCotationsTickerBoursorama | undefined {
    const document = new DOMParser()
      .parseFromString(html, 'text/html');

    const elDIV = document.querySelector('div.c-faceplate__price');
    const elLIs = document.querySelectorAll('li.c-list-info__item');

    if (elDIV && elLIs.length === 18) {
      const cours = ParseUtil.queryAndParseNumber(elDIV, 'span.c-instrument');

      const ouverture = ParseUtil.queryAndParseNumber(elLIs[2], 'span.c-instrument');
      const cloture = ParseUtil.queryAndParseNumber(elLIs[3], 'span.c-instrument');
      const plusHaut = ParseUtil.queryAndParseNumber(elLIs[4], 'span.c-instrument');
      const plusBas = ParseUtil.queryAndParseNumber(elLIs[5], 'span.c-instrument');
      const volume = ParseUtil.queryAndParseNumber(elLIs[6], 'span.c-instrument');

      const pourcentageCapitalEchange = ParseUtil.queryAndParseNumber(elLIs[7], 'p.c-list-info__value');
      const valorisation = ParseUtil.queryAndParseString(elLIs[8], 'p.c-list-info__value');

      const limiteBaisse = ParseUtil.queryAndParseNumber(elLIs[10], 'p.c-list-info__value');
      const limiteHausse = ParseUtil.queryAndParseNumber(elLIs[11], 'p.c-list-info__value');
      const pourcentageRendementEstime = ParseUtil.queryAndParseNumber(elLIs[12], 'p.c-list-info__value');
      const perEstime = ParseUtil.queryAndParseNumber(elLIs[13], 'p.c-list-info__value');
      const dernierDividende = ParseUtil.queryAndParseNumber(elLIs[14], 'p.c-list-info__value');
      const dateDernierDividende = ParseUtil.queryAndParseNumber(elLIs[15], 'p.c-list-info__value');

      const risqueESG = ParseUtil.queryAndParseString(elLIs[17], 'p.c-list-info__value');

      const achats: Array<DTOOrdre> = [];
      const ventes: Array<DTOOrdre> = [];
      this.parseAndMapOrdres(document, achats, ventes);

      return {
        cours, ouverture, cloture, plusHaut, plusBas, volume, pourcentageCapitalEchange,
        valorisation, limiteBaisse, limiteHausse, pourcentageRendementEstime,
        perEstime, dernierDividende, dateDernierDividende, risqueESG, achats, ventes
      };
    }
    return undefined;
  }

  private parseAndMapOrdres(document: Document, achats: Array<DTOOrdre>, ventes: Array<DTOOrdre>) {
    const elTABLEs = document.querySelectorAll('table.c-orderbook__table');

    if (elTABLEs.length === 2) {
      elTABLEs[1].querySelectorAll('tbody > tr.c-table__row').forEach(elTR => {
        const elTDs = elTR.querySelectorAll('td');
        if (elTDs.length === 6) {
          achats.push({
            nb: ParseUtil.parseNumber(elTDs[0].innerText),
            prix: ParseUtil.parseNumber(elTDs[2].innerText),
            quantite: ParseUtil.parseNumber(elTDs[1].innerText)
          });
          ventes.push({
            nb: ParseUtil.parseNumber(elTDs[5].innerText),
            prix: ParseUtil.parseNumber(elTDs[3].innerText),
            quantite: ParseUtil.parseNumber(elTDs[4].innerText)
          });
        }
      });
    }
  }
}
