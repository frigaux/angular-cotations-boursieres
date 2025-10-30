import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {DTOInformationsTickerABCBourse} from './dto-informations-ticker-abc-bourse.class';
import {DTOActualiteTicker} from './dto-actualite-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTOIndicateur} from './dto-ratio.class';
import {ParseUtil} from '../commun/parse-util.class';
import {DTOActualitesABCBourse} from './dto-actualites-abc-bourse.class';
import {DTOLien} from './dto-lien.class';
import {DTOVentesADecouvert} from './dto-ventes-a-decouvert.class';
import {DTOTransaction} from './dto-transaction.class';
import {DTOCotations} from './dto-cotations.interface';

@Injectable({
  providedIn: 'root'
})
export class AbcBourseService {
  private static readonly HEADERS = new HttpHeaders()
    .set('Accept', 'text/html; charset=utf-8');

  constructor(private http: HttpClient) {
  }

  public chargerInformationsTicker(ticker: string): Observable<DTOInformationsTickerABCBourse> {
    return new Observable(observer => {
      this.http.get(`/abcbourse/cotation/${ticker}p`, {
        headers: AbcBourseService.HEADERS,
        responseType: 'text'
      }).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: html => {
          observer.next(this.parseAndMapInformations(html, ticker));
          observer.complete();
        }
      });
    });
  }

  private parseAndMapInformations(html: string, ticker: string): DTOInformationsTickerABCBourse {
    const result = new DTOInformationsTickerABCBourse(ticker);

    const document = new DOMParser().parseFromString(html, 'text/html');

    result.cotations = this.parseAndMapCotations(document);

    ParseUtil.execRegexpAndMap(
      result.actualites,
      html,
      new RegExp('<div class="newsln2">\\s*<div>([^>]+)<\\/div>\\s*<div><a href="([^"]+)">([^>]+)<\\/a>', 'gm'),
      (matches) => new DTOActualiteTicker(ParseUtil.parseAndMapTo8601(matches[1]), matches[3], matches[2])
    );

    const elTables = document.querySelectorAll('table.tableDis');

    if (elTables.length === 4) {
      this.mapVariations(result.variations, elTables[0]);
      this.mapDividendes(result.dividendes, elTables[1]);
      this.mapRatios(result.ratios.indicateurs, elTables[2]);
      this.mapIndicateurs(result, elTables[3]);
    }
    if (elTables.length === 3) { // bloc dividende facultatif
      this.mapVariations(result.variations, elTables[0]);
      this.mapRatios(result.ratios.indicateurs, elTables[1]);
      this.mapIndicateurs(result, elTables[2]);
    }

    return result;
  }

  private parseAndMapCotations(document: Document): DTOCotations | undefined {
    const elDiv = document.querySelector('div.disqzone');
    const elTables = document.querySelectorAll('table.mar6');
    const elTrs0 = elTables[0].querySelectorAll('tr');
    const elTrs1 = elTables[1].querySelectorAll('tr');
    if (elDiv && elTables.length === 3 && elTrs0.length === 6 && elTrs1.length === 5) {
      const cours = ParseUtil.queryAndParseNumber(elDiv, '#lastcx');
      const volume = ParseUtil.queryAndParseNumber(elTrs0[0], 'td.alri');
      const ouverture = ParseUtil.queryAndParseNumber(elTrs0[1], 'td.alri');
      const plusHaut = ParseUtil.queryAndParseNumber(elTrs0[2], 'td.alri');
      const plusBas = ParseUtil.queryAndParseNumber(elTrs0[3], 'td.alri');
      const cloture = ParseUtil.queryAndParseNumber(elTrs0[4], 'td.alri');
      const pourcentageVolatilite = ParseUtil.queryAndParseNumber(elTrs0[5], 'td.alri');
      const pourcentageCapitalEchange = ParseUtil.queryAndParseNumber(elTrs1[0], 'td.alri');
      const valorisation = ParseUtil.queryAndParseString(elTrs1[1], 'td.alri');
      return {
        cours, volume, ouverture, plusHaut, plusBas, clotureVeille: cloture,
        pourcentageVolatilite, pourcentageCapitalEchange, valorisation
      };
    }
    return undefined;
  }

  private mapVariations(variations: DTOVariation[], elTable: Element) {
    elTable.querySelectorAll('tbody > tr:not(:last-child)')
      .forEach(elTr => {
        const elTds = elTr.querySelectorAll('td');
        variations.push(new DTOVariation(elTds[0].innerText, ParseUtil.parseNumber(elTds[4].innerText) / 100));
      });
  }

  private mapDividendes(dividendes: DTODividende[], elTable: Element) {
    elTable.querySelectorAll('tr:not(:first-child)')
      .forEach(elTr => {
        const elTds: NodeListOf<HTMLTableCellElement> = elTr.querySelectorAll('td');
        dividendes.push(new DTODividende(ParseUtil.parseYear(elTds[0].innerText), ParseUtil.parseNumber(elTds[1].innerText)));
      });
  }

  private mapRatios(ratios: DTOIndicateur[], elTable: Element) {
    const elThsAnnees: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('thead > tr > th:not(:first-child)');
    const elTdsBnpa: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr:nth-child(1) > td:not(:first-child)');
    const elTdsPer: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr:nth-child(2) > td:not(:first-child)');
    for (let i = 0; i < elThsAnnees.length; i++) {
      ratios.unshift(new DTOIndicateur(
        ParseUtil.parseYear(elThsAnnees[i].innerText),
        ParseUtil.parseNumber(elTdsBnpa[i].innerText),
        ParseUtil.parseNumber(elTdsPer[i].innerText))
      );
    }
  }

  private mapIndicateurs(result: DTOInformationsTickerABCBourse, elTable: Element) {
    const elTrs: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr');

    const elTdVariation: HTMLTableCellElement | null = elTrs[0].querySelector('td:nth-child(2)');
    if (elTdVariation) {
      result.ratios.variationCAC = ParseUtil.parseNumber(elTdVariation.innerText);
    }

    const elTdCorrelation: HTMLTableCellElement | null = elTrs[1].querySelector('td:nth-child(2)');
    if (elTdCorrelation) {
      result.ratios.correlationCAC = ParseUtil.parseNumber(elTdCorrelation.innerText) / 100;
    }

    // qualité financière facultative
    const elSpanQualite: HTMLSpanElement | null = elTrs[2]?.querySelector('td:nth-child(2) > span');
    if (elSpanQualite) {
      result.ratios.qualiteFinanciere = elSpanQualite.innerText;
    }
  }

  public chargerLien(pathname: string): Observable<string> {
    return new Observable(observer => {
      if (!pathname.startsWith('/')) {
        pathname = '/' + pathname;
      }
      this.http.get(`/abcbourse${pathname}`, {
        headers: AbcBourseService.HEADERS,
        responseType: 'text'
      }).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: html => {
          observer.next(ParseUtil.parseAndMapTagArticle(html));
          observer.complete();
        }
      });
    });
  }

  public chargerActualites(): Observable<DTOActualitesABCBourse> {
    return new Observable(observer => {
      this.http.get('/abcbourse', {headers: AbcBourseService.HEADERS, responseType: 'text'}).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: html => {
          this.parseActualites(html).subscribe({
            error: httpResponseError => {
              observer.error(httpResponseError);
              observer.complete();
            },
            next: dto => {
              observer.next(dto);
              observer.complete();
            }
          });
        }
      });
    });
  }

  private parseActualites(html: string): Observable<DTOActualitesABCBourse> {
    return new Observable(observer => {
      const result = new DTOActualitesABCBourse();
      this.parseAndMapLiens(html, result);

      let pathnameMarches = new RegExp('<span>Marchés<\\/span>\\s*<\\/div>\\s*<div class="hptit">\\s*<a href="([^"]+)"', 'gm');
      if (ParseUtil.isMobile()) {
        pathnameMarches = new RegExp('<div class="newshmecont">\\s*<div class="newshme clearfix" onclick="location.href=\'([^\']+)\'', 'gm');
      }
      const match = pathnameMarches.exec(html);
      if (match) {
        forkJoin([
          this.http.get(`/abcbourse${match[1]}`, {headers: AbcBourseService.HEADERS, responseType: 'text'}),
          this.http.get(`/abcbourse/marches/vad`, {headers: AbcBourseService.HEADERS, responseType: 'text'}),
          this.http.get(`/abcbourse/marches/transactions_dirigeants`, {
            headers: AbcBourseService.HEADERS,
            responseType: 'text'
          })
        ]).subscribe({
          error: httpResponseError => {
            observer.error(httpResponseError);
            observer.complete();
          },
          next: htmls => {
            result.marches = ParseUtil.parseAndMapTagArticle(htmls[0]);
            ParseUtil.execRegexpAndMap(
              result.ventesADecouvert,
              htmls[1],
              new RegExp('<tr class="alri">\\s*<td class="allf"><a href="([^"]+)">([^"]+)<\\/a><\\/td>\\s*<td>([^"<]+)<\\/td>\\s*<td>([^"<]+)<\\/td>\\s*<td>([^"<]+)<\\/td>', 'gm'),
              (matches) => new DTOVentesADecouvert(matches[2], matches[1], ParseUtil.parseNumber(matches[3]) / 100, ParseUtil.parseNumber(matches[4]), ParseUtil.parseNumber(matches[5]))
            );
            result.transactionsDirigeants = this.parseAndMapTransactions(htmls[2]);
            observer.next(result);
            observer.complete();
          }
        });
      }
    });
  }

  private parseAndMapLiens(html: string, result: DTOActualitesABCBourse) {
    if (ParseUtil.isMobile()) {
      const elDivs = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelectorAll('div.homat');

      if (elDivs.length === 1) {
        ParseUtil.execRegexpAndMap(
          result.analyses,
          elDivs[0].innerHTML,
          new RegExp('<a href="([^"]+)"><span>([^<]+)<\\/span> : ([^<]+)', 'gm'),
          (matches) => new DTOLien(undefined, matches[2], matches[3], matches[1])
        );
      }

      ParseUtil.execRegexpAndMap(
        result.chroniques,
        html,
        new RegExp('<div class="newsln">\\s*<div>(\\d{2}:\\d{2})<\\/div>\\s*<div><a href="([^"]+)">(<span>([^<]+)<\\/span> : )?([^<]+)<\\/a>', 'gm'),
        (matches) => new DTOLien(matches[1], matches[4], matches[5], matches[2])
      );
    } else {
      const elDivs = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelectorAll('div.hom_ncont');

      if (elDivs.length === 2) {
        ParseUtil.execRegexpAndMap(
          result.analyses,
          elDivs[0].innerHTML,
          new RegExp('(\\d{2}\\/\\d{2})<a href="([^"]+)"><span>([^<]+)<\\/span> : ([^<]+)', 'gm'),
          (matches) => new DTOLien(matches[1], matches[3], matches[4], matches[2])
        );
        ParseUtil.execRegexpAndMap(
          result.chroniques,
          elDivs[1].innerHTML,
          new RegExp('(\\d{2}:\\d{2})<a href="([^"]+)">(<span>([^<]+)<\\/span> : )?([^<]+)', 'gm'),
          (matches) => new DTOLien(matches[1], matches[4], matches[5], matches[2])
        );
      }
    }
  }

  private parseAndMapTransactions(html: string): Array<DTOTransaction> {
    const r1 = new RegExp('<tr>\\s*<td><a href="([^"]+)">([^<]+)<\\/a><\\/td>\\s*<td>([^<]+)<\\/td>\\s*<td class="[^"]*">([^<]+)<\\/td>\\s*<td>([^<]+)<\\/td>\\s*<td>([^<]+)<\\/td>', 'gm');
    const r2 = new RegExp('Auteur: <\\/span>([^<]+)<\\/td>\\s*<\\/tr>\\s*<tr>\\s*<td><span class="bold">Date d\'opération: <\\/span>([^<]+)<\\/td>\\s*<td><span class="bold">Quantité: <\\/span>([^<]+)<\\/td>\\s*<td><span class="bold">Prix: <\\/span>([^<]+)', 'gm');

    const result: Array<DTOTransaction> = [];
    let m1, m2;
    let i = 0;
    while ((m1 = r1.exec(html)) && (m2 = r2.exec(html))) {
      result.push(new DTOTransaction(i++, m1[2], m1[1], ParseUtil.parseAndMapTo8601(m1[3]), m1[4], m1[5], ParseUtil.parseNumber(m1[6]),
        m2[1], ParseUtil.parseAndMapTo8601(m2[2]), ParseUtil.parseNumber(m2[3]), ParseUtil.parseNumber(m2[4])));
    }
    return result;
  }
}
