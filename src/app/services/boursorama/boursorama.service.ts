import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {DTOCours} from '../cours/dto-cours.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DTOCoursBoursorama} from './dto-cours-boursorama.interface';
import {DTOOrdre} from './dto-ordre.interface';
import {ParseUtil} from '../commun/parse-util.class';
import {DTOInformationsTickerBoursorama} from './dto-informations-ticker-boursorama.interface';
import {DTOInformation} from './dto-information.interface';
import {DTOCotations} from './dto-cotations.interface';
import {DTOValeur} from './dto-valeur.interface';
import {TranslateService} from '@ngx-translate/core';
import {DtoTransaction} from './dto-transaction.interface';
import {DTOHistoriqueJour} from './dto-historique-jour.interface';
import {DTOHistoriquePeriode} from './dto-historique-periode.interface';

@Injectable({
  providedIn: 'root'
})
export class BoursoramaService {
  private static readonly HEADERS_JSON = new HttpHeaders()
    .set('Accept', 'application/json');
  private static readonly HEADERS_HTML = new HttpHeaders()
    .set('Accept', 'text/html');

  constructor(private http: HttpClient,
              private translateService: TranslateService) {
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

  public chargerInformationsTicker(valeur: DTOValeur): Observable<DTOInformationsTickerBoursorama> {
    return new Observable(observer => {
      this.http.get(`/boursorama/cours/1rP${valeur.ticker}/`, {
        headers: BoursoramaService.HEADERS_HTML,
        responseType: 'text'
      }).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: html => {
          const dto = this.parseAndMapInformationsTicker(valeur, html);
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

  public chargerInformationsTickers(valeurs: Array<DTOValeur>): Observable<Array<DTOInformationsTickerBoursorama>> {
    return new Observable(observer => {
      forkJoin(valeurs.map(cours =>
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
          const resultat: Array<DTOInformationsTickerBoursorama> = [];
          htmls.forEach((html: string, i: number) => {
            const dto = this.parseAndMapInformationsTicker(valeurs[i], html);
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

  private parseAndMapInformationsTicker(valeur: DTOValeur, html: string): DTOInformationsTickerBoursorama | undefined {
    const document = new DOMParser()
      .parseFromString(html, 'text/html');

    const elDIVCours = document.querySelector('div.c-faceplate__price');
    const elLIsCotations = document.querySelectorAll('li.c-list-info__item');
    const elULsNouvelles = document.querySelectorAll('ul.c-list-news');
    const elTableTransactions = document.querySelector('table[data-ist-last-transactions]');
    const elTables = document.querySelectorAll('table.c-table--generic');

    if (elDIVCours && elLIsCotations.length === 18 && elULsNouvelles.length === 3 && elTableTransactions
      && elTables.length >= 4) {
      const cotations = this.parseAndMapCotations(elDIVCours, elLIsCotations);
      const ordres = this.parseAndMapOrdres(document);
      const actualites = this.parseAndMapInformations(elULsNouvelles[1]);
      const analyses = this.parseAndMapInformations(elULsNouvelles[2]);
      const chartData = this.parseAndMapChart(html);
      const transactions = this.parseAndMapTransactions(elTableTransactions);
      const historiqueJours = this.parseAndMapHistoriqueJours(elTables[0]);
      const historiquePeriodes = this.parseAndMapHistoriquePeriodes(elTables[3]);

      return {
        valeur,
        cotations,
        achats: ordres.achats,
        ventes: ordres.ventes,
        actualites,
        analyses,
        chartData,
        transactions,
        historiqueJours,
        historiquePeriodes
      };
    }
    return undefined;
  }

  private parseAndMapCotations(elDIVCours: Element, elLIsCotations: NodeListOf<Element>): DTOCotations {
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
    return {
      cours, ouverture, clotureVeille: cloture, plusHaut, plusBas, volume,
      pourcentageCapitalEchange, valorisation, limiteBaisse, limiteHausse, pourcentageRendementEstime,
      perEstime, dernierDividende, dateDernierDividende, risqueESG
    };
  }

  private parseAndMapOrdres(document: Document) {
    const elTABLEsOrdres = document.querySelectorAll('table.c-orderbook__table');

    const achats: Array<DTOOrdre> = [];
    const ventes: Array<DTOOrdre> = [];
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
    return {
      achats, ventes
    };
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

  public chargerLien(pathname: string): Observable<string> {
    return new Observable(observer => {
      if (!pathname.startsWith('/')) {
        pathname = '/' + pathname;
      }
      this.http.get(`/boursorama${pathname}`, {
        headers: BoursoramaService.HEADERS_HTML,
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

  private parseAndMapChart(html: string): Object | undefined {
    const regexp = /var chart\s*= JSON.parse\('([^']+)'\);/gm;
    const matches = regexp.exec(html);
    if (matches) {
      const json = matches[1];
      const config = JSON.parse(json);
      if (config && config.data && config.data.amChartConfig.graphs && config.data.amChartData) {
        const id = config.data.amChartConfig.graphs[0].id;
        const chartData = config.data.amChartData[id];

        const labels: Array<string> = [];
        const data: Array<number> = [];
        chartData.forEach((chartData: any) => {
          labels.push(chartData.period);
          data.push(chartData.value);
        });
        return {
          labels,
          datasets: [
            {
              label: this.translateService.instant('SERVICES.BOURSORAMA.COURS'),
              data,
              tension: 0.4
            }
          ]
        };
      }
    }
    return undefined;
  }

  private parseAndMapTransactions(elTableTransactions: Element): Array<DtoTransaction> {
    const transactions: Array<DtoTransaction> = [];
    elTableTransactions.querySelectorAll('tbody > tr.c-table__row').forEach(elTR => {
      const elTDs = elTR.querySelectorAll('td.c-table__cell');
      if (elTDs.length === 3) {
        const heure = elTDs[0].innerHTML.trim();
        const cours = ParseUtil.parseNumber(elTDs[1].innerHTML);
        const quantite = ParseUtil.parseNumber(elTDs[2].innerHTML);
        transactions.push({heure, cours, quantite});
      }
    });
    return transactions;
  }

  private parseAndMapHistoriqueJours(elTable: Element): Array<DTOHistoriqueJour> {
    const elSPANs = elTable.querySelectorAll('thead th.c-table__cell > span:nth-child(2)');
    const elTRs = elTable.querySelectorAll('tbody > tr.c-table__row');
    if (elSPANs.length === 5 && elTRs.length === 6) {
      const jours: Array<string> = [];
      const clotures: Array<number> = [];
      const pourcentagesVariations: Array<number> = [];
      const ouvertures: Array<number> = [];
      const plusHauts: Array<number> = [];
      const plusBas: Array<number> = [];
      const volumes: Array<number> = [];
      elSPANs.forEach(elSPAN => jours.push(elSPAN.innerHTML.trim()));
      elTRs[0].querySelectorAll('td.c-table__cell')
        .forEach(elTD => clotures.push(ParseUtil.parseNumber(elTD.innerHTML)));
      elTRs[1].querySelectorAll('td.c-table__cell')
        .forEach(elTD => pourcentagesVariations.push(ParseUtil.parseNumber(elTD.innerHTML)));
      elTRs[2].querySelectorAll('td.c-table__cell')
        .forEach(elTD => ouvertures.push(ParseUtil.parseNumber(elTD.innerHTML)));
      elTRs[3].querySelectorAll('td.c-table__cell')
        .forEach(elTD => plusHauts.push(ParseUtil.parseNumber(elTD.innerHTML)));
      elTRs[4].querySelectorAll('td.c-table__cell')
        .forEach(elTD => plusBas.push(ParseUtil.parseNumber(elTD.innerHTML)));
      elTRs[5].querySelectorAll('td.c-table__cell')
        .forEach(elTD => volumes.push(ParseUtil.parseNumber(elTD.innerHTML)));
      if (jours.length === 5 && clotures.length === 5 && pourcentagesVariations.length === 5
        && ouvertures.length === 5 && plusHauts.length === 5 && plusBas.length === 5 && volumes.length === 5) {
        return jours.map((jour, i) => ({
          jour,
          cloture: clotures[i],
          pourcentageVariation: pourcentagesVariations[i],
          ouverture: ouvertures[i],
          plusHaut: plusHauts[i],
          plusBas: plusBas[i],
          volume: volumes[i]
        }));
      }
    }
    return [];
  }

  private parseAndMapHistoriquePeriodes(elTable: Element): Array<DTOHistoriquePeriode> {
    const historiques: Array<DTOHistoriquePeriode> = [];
    elTable.querySelectorAll('tbody > tr.c-table__row')
      .forEach(elTr => {
        const elTH = elTr.querySelector('th.c-table__cell');
        const elTDs = elTr.querySelectorAll('td.c-table__cell');
        if (elTH && elTDs.length === 3) {
          const periode = elTH.innerHTML.trim();
          const pourcentageVariation = ParseUtil.parseNumber(elTDs[0].innerHTML);
          const plusHaut = ParseUtil.parseNumber(elTDs[1].innerHTML);
          const plusBas = ParseUtil.parseNumber(elTDs[2].innerHTML);
          historiques.push({periode, pourcentageVariation, plusHaut, plusBas});
        }
      });
    return historiques;
  }
}
