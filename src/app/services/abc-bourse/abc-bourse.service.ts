import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DTOInformationsTicker} from './dto-informations-ticker.class';
import {DTOInformationTicker} from './dto-information-ticker.class';
import {DTODividende} from './dto-dividende.class';
import {DTOVariation} from './dto-variation.class';
import {DTORatio} from './dto-ratio.class';

@Injectable({
  providedIn: 'root'
})
export class AbcBourseService {
  private static readonly regexpNumber = /-?[0-9]+,[0-9]+/g;
  private static readonly regexpYear = /[0-9]{4}/g;

  constructor(private http: HttpClient) {
  }

  public chargerInformationsTicker(ticker: string): Observable<DTOInformationsTicker> {
    return new Observable(observer => {
      const headers = new HttpHeaders()
        .set('Accept', 'text/html; charset=utf-8');
      this.http.get(`abcbourse/cotation/${ticker}p`, {headers, responseType: 'text'}
      ).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: html => {
          observer.next(this.parseAndMap(html, ticker));
          observer.complete();
        }
      });
    });
  }

  private parseAndMap(html: string, ticker: string): DTOInformationsTicker {
    const result = new DTOInformationsTicker(ticker);

    this.execRegexpAndMap(
      result.informations,
      html,
      new RegExp('<div class="newsln2">\\s*<div>([^>]+)<\\/div>\\s*<div><a href="([^"]+)">([^>]+)<\\/a>', 'gm'),
      (matches) => new DTOInformationTicker(matches[1], matches[3])
    );

    const elTables = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelectorAll('table.tableDis');

    this.mapVariations(result.variations, elTables[0]);
    this.mapDividendes(result.dividendes, elTables[1]);
    this.mapRatios(result.ratios, elTables[2]);
    this.mapIndicateurs(result, elTables[3]);

    return result;
  }

  private execRegexpAndMap<T>(result: Array<T>, html: string, regexp: RegExp, mapper: (m: Array<string>) => T) {
    let matches;
    while ((matches = regexp.exec(html))) {
      result.push(mapper(matches));
    }
  }

  private mapVariations(variations: DTOVariation[], elTable: Element) {
    elTable.querySelectorAll('tbody > tr:not(:last-child)')
      .forEach(elTr => {
        const elTds = elTr.querySelectorAll('td');
        variations.push(new DTOVariation(elTds[0].innerText, this.parseNumber(elTds[4].innerText) / 100));
      });
  }

  private mapDividendes(dividendes: DTODividende[], elTable: Element) {
    elTable.querySelectorAll('tr:not(:first-child)')
      .forEach(elTr => {
        const elTds: NodeListOf<HTMLTableCellElement> = elTr.querySelectorAll('td');
        dividendes.push(new DTODividende(this.parseYear(elTds[0].innerText), this.parseNumber(elTds[1].innerText)));
      });
  }

  private mapRatios(ratios: DTORatio[], elTable: Element) {
    const elThsAnnees: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('thead > tr > th:not(:first-child)');
    const elTdsBnpa: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr:nth-child(1) > td:not(:first-child)');
    const elTdsPer: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr:nth-child(2) > td:not(:first-child)');
    for (let i = 0; i < elThsAnnees.length; i++) {
      ratios.unshift(new DTORatio(
        this.parseYear(elThsAnnees[i].innerText),
        this.parseNumber(elTdsBnpa[i].innerText),
        this.parseNumber(elTdsPer[i].innerText))
      );
    }
  }

  private mapIndicateurs(result: DTOInformationsTicker, elTable: Element) {
    const elTrs: NodeListOf<HTMLTableCellElement> = elTable.querySelectorAll('tbody > tr');

    const elTdVariation: HTMLTableCellElement | null = elTrs[0].querySelector('td:nth-child(2)');
    if (elTdVariation) {
      result.variationCAC = this.parseNumber(elTdVariation.innerText);
    }

    const elTdCorrelation: HTMLTableCellElement | null = elTrs[1].querySelector('td:nth-child(2)');
    if (elTdCorrelation) {
      result.correlationCAC = this.parseNumber(elTdCorrelation.innerText) / 100;
    }

    const elSpanQualite: HTMLSpanElement | null = elTrs[2].querySelector('td:nth-child(2) > span');
    if (elSpanQualite) {
      result.qualiteFinanciere = elSpanQualite.innerText;
    }
  }

  private parseNumber(str: string): number {
    const match = str.match(AbcBourseService.regexpNumber);
    if (match) {
      return Number(match[0].replace(',', '.'));
    }
    return NaN;
  }

  private parseYear(str: string): number {
    const match = str.match(AbcBourseService.regexpYear);
    if (match) {
      return Number(match[0]);
    }
    return NaN;
  }
}
