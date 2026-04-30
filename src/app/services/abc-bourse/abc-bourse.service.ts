import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {DTOInformationsTickerABCBourse} from './dto-informations-ticker-abc-bourse.class';
import {DTOActualiteTicker} from './dto-actualite-ticker.class';
import {DTODividendeTicker} from './dto-dividende-ticker.class';
import {DTOVariationTicker} from './dto-variation-ticker.class';
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
      const pathname = `/abcbourse/cotation/${ticker}p`;
      this.http.get(pathname, {
        headers: AbcBourseService.HEADERS,
        responseType: 'text',
        observe: 'response'
      }).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: response => {
          let url = response.url!;
          url = url.replaceAll('%2F', '/').replaceAll('%3A', ':');
          url = url.slice(url.indexOf('http://'));
          const pathnameResponse = new URL(url).pathname;
          if (pathname !== pathnameResponse) { // 301 : apache a appliqué la RewriteRule vers index.html
            this.http.get(`/abcbourse${pathnameResponse}`, {
              headers: AbcBourseService.HEADERS,
              responseType: 'text'
            }).subscribe({
              error: httpErrorResponse => {
                observer.error(httpErrorResponse);
                observer.complete();
              },
              next: html => {
                observer.next(this.parseAndMapInformations(html, ticker));
                observer.complete();
              }
            });
          } else {
            observer.next(this.parseAndMapInformations(response.body ?? '', ticker));
            observer.complete();
          }
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
      (matches) => new DTOActualiteTicker(ParseUtil.parseDateFrAndMapTo8601(matches[1]) || matches[1], matches[3], matches[2])
    );

    const elTableVariations = document.querySelector('table.tblDisVar');
    const elTables = document.querySelectorAll('div.disZone3 table.tablesorter');

    if (elTableVariations) {
      this.mapVariations(result.variations, elTableVariations);
    }

    if (elTables.length === 3) {
      this.mapDividendes(result.dividendes, elTables[0]);
      this.mapRatios(result.ratios.indicateurs, elTables[1]);
      this.mapIndicateurs(result, elTables[2]);
    }
    if (elTables.length === 2) { // le bloc dividende est facultatif
      this.mapRatios(result.ratios.indicateurs, elTables[0]);
      this.mapIndicateurs(result, elTables[1]);
    }

    return result;
  }

  private parseAndMapCotations(document: Document): DTOCotations | undefined {
    const elDiv = document.querySelector('div.barquotezone');
    const elTables = document.querySelectorAll('div.chartzone table.tablesorter');
    const elTrs0 = elTables[0].querySelectorAll('tr');
    const elTrs1 = elTables[1].querySelectorAll('tr');
    if (elDiv && elTables.length === 3 && elTrs0.length === 6 && elTrs1.length === 5) {
      const cours = ParseUtil.queryAndParseNumber(elDiv, '#lastcx');
      const volume = ParseUtil.queryAndParseNumber(elTrs0[0], 'td.alri');
      const ouverture = ParseUtil.queryAndParseNumber(elTrs0[1], 'td.alri');
      const plusHaut = ParseUtil.queryAndParseNumber(elTrs0[2], 'td.alri');
      const plusBas = ParseUtil.queryAndParseNumber(elTrs0[3], 'td.alri');
      const cloture = ParseUtil.queryAndParseNumber(elTrs0[4], 'td.alri');
      const pourcentageVolatilite = ParseUtil.queryAndParseNumber(elTrs0[5], 'td.alri') / 100;
      const pourcentageCapitalEchange = ParseUtil.queryAndParseNumber(elTrs1[0], 'td.alri') / 100;
      const valorisation = ParseUtil.queryAndParseString(elTrs1[1], 'td.alri');
      return {
        cours, volume, ouverture, plusHaut, plusBas, clotureVeille: cloture,
        pourcentageVolatilite, pourcentageCapitalEchange, valorisation
      };
    } else {
      console.error('Impossible de récupérer les cotations', document);
    }
    return undefined;
  }

  private mapVariations(variations: DTOVariationTicker[], elTable: Element) {
    elTable.querySelectorAll('tbody > tr:not(:last-child)')
      .forEach(elTr => {
        const elTds = elTr.querySelectorAll('td');
        variations.push(new DTOVariationTicker(elTds[0].innerText, ParseUtil.parseNumber(elTds[4].innerText) / 100));
      });
  }

  private mapDividendes(dividendes: DTODividendeTicker[], elTable: Element) {
    elTable.querySelectorAll('tbody > tr')
      .forEach(elTr => {
        const elTds: NodeListOf<HTMLTableCellElement> = elTr.querySelectorAll('td');
        dividendes.push(new DTODividendeTicker(ParseUtil.parseYear(elTds[0].innerText), ParseUtil.parseNumber(elTds[1].innerText)));
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
    elTrs.forEach((elTr, i) => {
      const indicateur = elTr.querySelector('td.t1 > a')?.innerHTML.trim();
      if (indicateur?.startsWith('Beta')) {
        const elTdVariation: HTMLTableCellElement | null = elTr.querySelector('td:nth-child(2)');
        if (elTdVariation) {
          result.ratios.variationCAC = ParseUtil.parseNumber(elTdVariation.innerText);
        }
      }
      if (indicateur?.startsWith('Corr')) {
        const elTdCorrelation: HTMLTableCellElement | null = elTr.querySelector('td:nth-child(2)');
        if (elTdCorrelation) {
          result.ratios.correlationCAC = ParseUtil.parseNumber(elTdCorrelation.innerText) / 100;
        }
      }
      if (indicateur?.startsWith('Note')) {
        const elSpanQualite: HTMLSpanElement | null = elTr.querySelector('td:nth-child(2) > span');
        if (elSpanQualite) {
          result.ratios.qualiteFinanciere = elSpanQualite.innerText;
        }
      }
    });
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
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
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
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: html => {
          this.parseActualites(html).subscribe({
            error: httpErrorResponse => {
              observer.error(httpErrorResponse);
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

      let pathnameMarches = ParseUtil.isMobile()
        ? new RegExp('<h2 class="nf-title">\\s*<a class="nf-link" href="([^"]+)', 'gm')
        : new RegExp('<article class="news-feature">\\s*<a class="nf-media" href="([^"]+)"', 'gm');

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
          error: httpErrorResponse => {
            observer.error(httpErrorResponse);
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
    const divNews = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelectorAll('div.hom_ncont');

    if (divNews.length === 1) {
      ParseUtil.execRegexpAndMap(
        result.nouvelles,
        divNews[0].innerHTML,
        new RegExp('<span class="news-time">(\\d{2}:\\d{2})<\\/span>\\s*<a href="([^"]+)">([^<]+)', 'gm'),
        (matches) => new DTOLien(matches[1], undefined, matches[3], matches[2])
      );
    }

    ParseUtil.execRegexpAndMap(
      result.analyses,
      html,
      new RegExp('<article class="lastana-item">\\s*<a class="lastana-link" href="([^"]+)">\\s*<span class="lastana-name">([^<]+)<\\/span>:\\s*<span class="lastana-ttl">([^<]+)<\\/span>\\s*<\\/a>\\s*<div class="lastana-meta">([^<]+)', 'gm'),
      (matches) => new DTOLien(matches[4], matches[2], matches[3], matches[1])
    );
    ParseUtil.execRegexpAndMap(
      result.chroniques,
      html,
      new RegExp('<a class="ch-link" href="([^"]+)">([^<]+)<\\/a>\\s*<\\/h3>\\s*<p class="ch-chapo">\\s*([^<]+)', 'gm'),
      (matches) => new DTOLien(undefined, matches[2], matches[3], matches[1])
    );
  }

  private parseAndMapTransactions(html: string): Array<DTOTransaction> {
    const r1 = new RegExp('<tr>\\s*<td><a href="([^"]+)">([^<]+)<\\/a><\\/td>\\s*<td>([^<]+)<\\/td>\\s*<td class="[^"]*">([^<]+)<\\/td>\\s*<td>([^<]+)<\\/td>\\s*<td>([^<]+)<\\/td>', 'gm');
    const r2 = new RegExp('Auteur: <\\/span>([^<]+)<\\/td>\\s*<\\/tr>\\s*<tr>\\s*<td><span class="bold">Date d\'opération: <\\/span>([^<]+)<\\/td>\\s*<td><span class="bold">Quantité: <\\/span>([^<]+)<\\/td>\\s*<td><span class="bold">Prix: <\\/span>([^<]+)', 'gm');

    const result: Array<DTOTransaction> = [];
    let m1, m2;
    let i = 0;
    while ((m1 = r1.exec(html)) && (m2 = r2.exec(html))) {
      result.push(new DTOTransaction(i++, m1[2], m1[1], ParseUtil.parseDateFrAndMapTo8601(m1[3]) || m1[3], m1[4], m1[5], ParseUtil.parseNumber(m1[6]),
        m2[1], ParseUtil.parseDateFrAndMapTo8601(m2[2]) || m2[2], ParseUtil.parseNumber(m2[3]), ParseUtil.parseNumber(m2[4])));
    }
    return result;
  }
}
