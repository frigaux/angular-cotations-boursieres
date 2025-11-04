import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {DTOCours} from '../cours/dto-cours.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DTOCoursBoursorama} from './dto-cours-boursorama.interface';
import {DTOOrdre} from './dto-ordre.interface';
import {ParseUtil} from '../commun/parse-util.class';
import {DTOCotationsTickerBoursorama} from './dto-cotations-ticker-boursorama.interface';
import {CoursPortefeuille} from '../../components/portefeuilles/cours-portefeuille.class';
import {DTOInformation} from './dto-information.interface';

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
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: objects => {
          const resultat: Array<DTOCours> = [];
          objects.forEach((cours: DTOCoursBoursorama, i: number) => {
            resultat.push({
              ticker: tickers[i],
              ouverture: cours.d[0].o,
              plusHaut: cours.d[0].h,
              plusBas: cours.d[0].l,
              cloture: cours.d[0].c,
              volume: cours.d[0].v,
              moyennesMobiles: []
            });
          });
          observer.next(resultat);
          observer.complete();
        }
      });
    });
  }

  public chargerCotationsTicker(cours: CoursPortefeuille): Observable<DTOCotationsTickerBoursorama> {
    return new Observable(observer => {
      this.http.get(`/boursorama/cours/1rP${cours.ticker}/`, {
        headers: BoursoramaService.HEADERS_HTML,
        responseType: 'text'
      }).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: html => {
          const dto = this.parseAndMapCours(cours, html);
          if (dto) {
            observer.next(dto);
          } else {
            observer.error({
              message: 'Impossible de récupérer les informations dans le html',
              error: html
            })
          }
          observer.complete();
        }
      });
    });
  }

  public chargerCotationsTickers(coursPortefeuille: Array<CoursPortefeuille>): Observable<Array<DTOCotationsTickerBoursorama>> {
    return new Observable(observer => {
      forkJoin(coursPortefeuille.map(cours =>
        this.http.get(`/boursorama/cours/1rP${cours.ticker}/`, {
          headers: BoursoramaService.HEADERS_HTML,
          responseType: 'text'
        })
      )).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: htmls => {
          const resultat: Array<DTOCotationsTickerBoursorama> = [];
          htmls.forEach((html: string, i: number) => {
            const dto = this.parseAndMapCours(coursPortefeuille[i], html);
            if (dto) {
              resultat.push(dto);
            }
          });
          observer.next(resultat);
          observer.complete();
        }
      });
    });
  }

  private parseAndMapCours(coursPortefeuille: CoursPortefeuille, html: string): DTOCotationsTickerBoursorama | undefined {
    const document = new DOMParser()
      .parseFromString(html, 'text/html');

    const elDIVCours = document.querySelector('div.c-faceplate__price');
    const elLIsCotations = document.querySelectorAll('li.c-list-info__item');
    const elULsNouvelles = document.querySelectorAll('ul.c-list-news');

    if (elDIVCours && elLIsCotations.length === 18 && elULsNouvelles.length === 3) {
      const cours = ParseUtil.queryAndParseNumber(elDIVCours, 'span.c-instrument');

      const ouverture = ParseUtil.queryAndParseNumber(elLIsCotations[2], 'span.c-instrument');
      const cloture = ParseUtil.queryAndParseNumber(elLIsCotations[3], 'span.c-instrument');
      const plusHaut = ParseUtil.queryAndParseNumber(elLIsCotations[4], 'span.c-instrument');
      const plusBas = ParseUtil.queryAndParseNumber(elLIsCotations[5], 'span.c-instrument');
      const volume = ParseUtil.queryAndParseNumber(elLIsCotations[6], 'span.c-instrument');

      const pourcentageCapitalEchange = ParseUtil.queryAndParseNumber(elLIsCotations[7], 'p.c-list-info__value') / 100;
      const valorisation = ParseUtil.queryAndParseString(elLIsCotations[8], 'p.c-list-info__value');

      const limiteBaisse = ParseUtil.queryAndParseNumber(elLIsCotations[10], 'p.c-list-info__value');
      const limiteHausse = ParseUtil.queryAndParseNumber(elLIsCotations[11], 'p.c-list-info__value');
      const pourcentageRendementEstime = ParseUtil.queryAndParseNumber(elLIsCotations[12], 'p.c-list-info__value') / 100;
      const perEstime = ParseUtil.queryAndParseNumber(elLIsCotations[13], 'p.c-list-info__value');
      const dernierDividende = ParseUtil.queryAndParseNumber(elLIsCotations[14], 'p.c-list-info__value');
      const dateDernierDividende = ParseUtil.queryAndParseDate(elLIsCotations[15], 'p.c-list-info__value');

      const risqueESG = ParseUtil.queryAndParseString(elLIsCotations[17], 'p.c-list-info__value');

      const achats: Array<DTOOrdre> = [];
      const ventes: Array<DTOOrdre> = [];
      this.parseAndMapOrdres(document, achats, ventes);

      const actualites = this.parseAndMapInformations(elULsNouvelles[1]);
      const analyses = this.parseAndMapInformations(elULsNouvelles[2]);

      return {
        coursPortefeuille, cours, ouverture, clotureVeille: cloture, plusHaut, plusBas, volume,
        pourcentageCapitalEchange, valorisation, limiteBaisse, limiteHausse, pourcentageRendementEstime,
        perEstime, dernierDividende, dateDernierDividende, risqueESG, achats, ventes, actualites, analyses
      };
    }
    return undefined;
  }

  private parseAndMapOrdres(document: Document, achats: Array<DTOOrdre>, ventes: Array<DTOOrdre>) {
    const elTABLEsOrdres = document.querySelectorAll('table.c-orderbook__table');

    if (elTABLEsOrdres.length > 0) {
      elTABLEsOrdres[elTABLEsOrdres.length - 1].querySelectorAll('tbody > tr.c-table__row').forEach(elTR => {
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

  private parseAndMapInformations(elULNouvelles: Element): Array<DTOInformation> {
    const resultat: Array<DTOInformation> = [];
    let id = 0;
    elULNouvelles.querySelectorAll('li.c-list-news__line')
      .forEach(elLI => {
        const elSPAN = elLI.querySelector('span.c-list-news__date');
        const elA = elLI.querySelector('a');
        if (elSPAN && elA) {
          resultat.push({
            id: id++,
            date: elSPAN.innerHTML,
            titre: elA.innerHTML,
            pathname: elA.pathname
          });
        }
      });
    return resultat;
  }
}
