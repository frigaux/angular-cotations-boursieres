import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {DTOActualitesZoneBourse} from './dto-actualites-zone-bourse.interface';
import {HttpClient} from '@angular/common/http';
import {DTOValeur} from '../valeurs/dto-valeur.interface';

@Injectable({
  providedIn: 'root'
})
export class ZoneBourseService {
  // private static readonly HEADERS_HTML = new HttpHeaders()
  //   .set('Accept', 'text/html')
  //   .set('Accept-Encoding', 'gzip, deflate')
  //   .set('Accept-Language', 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7')
  //   .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36');

  private static readonly SCORE: Array<{ positif: string, negatif: string }> = [
    {positif: 'accroit', negatif: 'plonge'},
    {positif: 'achat', negatif: 'vente'},
    {positif: 'allege', negatif: 'pese'},
    {positif: 'conforte', negatif: 'divise'},
    {positif: 'croissant', negatif: 'decroissant'},
    {positif: 'encourageant', negatif: 'decevant'},
    {positif: 'essor', negatif: 'chute'},
    {positif: 'exceptionnel', negatif: 'catastrophique'},
    {positif: 'favorable', negatif: 'defavorable'},
    {positif: 'euphorie', negatif: 'inquietude'},
    {positif: 'gain', negatif: 'perte'},
    {positif: 'hausse', negatif: 'baisse'},
    {positif: 'optimiste', negatif: 'pessimiste'},
    {positif: 'performance', negatif: 'repli'},
    {positif: 'positif', negatif: 'negatif'},
    {positif: 'positive', negatif: 'negative'},
    {positif: 'progres', negatif: 'recul'},
    {positif: 'progresse', negatif: 'devisse'},
    {positif: 'rapide', negatif: 'lent'},
    {positif: 'accelere', negatif: 'ralentit'},
    {positif: 'rehausse', negatif: 'rabaisse'},
    {positif: 'remarquable', negatif: 'mediocre'},
    {positif: 'renforce', negatif: 'degrade'},
    {positif: 'repond', negatif: 'decoit'},
    {positif: 'reprise', negatif: 'rechute'},
    {positif: 'solide', negatif: 'fragile'},
    {positif: 'soutenu', negatif: 'ralenti'},
    {positif: 'stabilite', negatif: 'volatilite'}
  ];

  private static SCORE_REGEXP: Array<{ positif: RegExp, negatif: RegExp }>;

  constructor(private http: HttpClient) {
    ZoneBourseService.SCORE_REGEXP = ZoneBourseService.SCORE.map(mots => {
      return {
        positif: new RegExp(` ${mots.positif}[es]? `, 'gm'),
        negatif: new RegExp(` ${mots.negatif}[es]? `, 'gm'),
      };
    });
  }

  public chargerActualites(nombrePages: number, valeurByTicker: Map<string, DTOValeur>): Observable<Array<DTOActualitesZoneBourse>> {
    return new Observable(observer => {
      forkJoin(
        Array.from({length: nombrePages}, (v, i) => i + 1)
          .map(numeroPage =>
            this.http.get(`/zonebourse/actualite-bourse/?p=${numeroPage}`, {
              // headers: ZoneBourseService.HEADERS_HTML,
              responseType: 'text'
            })
          )).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: htmls => {
          let resultat: Array<DTOActualitesZoneBourse> = [];
          htmls.forEach(html => {
            resultat = resultat.concat(this.parseAndMapActualites(html, valeurByTicker));
          });
          observer.next(resultat);
          observer.complete();
        }
      });
    });
  }

  private parseAndMapActualites(html: string, valeurByTicker: Map<string, DTOValeur>): Array<DTOActualitesZoneBourse> {
    const resultat: Array<DTOActualitesZoneBourse> = [];
    const document = new DOMParser().parseFromString(html, 'text/html');
    const elTBody = document.querySelector('#newsScreener > tbody');
    if (elTBody) {
      const elTRs = elTBody.querySelectorAll('tr');
      elTRs.forEach(elTR => {
        const elAs = elTR.querySelectorAll('a');
        const elSpanDate = elTR.querySelector('span.js-date-relative');
        if (elAs.length >= 1 && elSpanDate) {
          const date = elSpanDate.innerHTML.trim();
          let ticker = undefined;
          // if (valeurByTicker.has(elSpanTicker.innerHTML.trim())) {
          //   ticker = elSpanTicker.innerHTML.trim();
          // }
          const titre = elAs[0].innerText.trim();
          const pathname = elAs[0].pathname;
          const score = this.calculerScore(titre);
          resultat.push({date, ticker, titre, pathname, score});
        }
      });
    }
    return resultat;
  }

  private calculerScore(titre: string): number {
    let score = 0;
    const titreSansAccent = titre.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const titreNettoye = titreSansAccent
      .replace(/[^\w]/g, ' ')
      .trim()
      .toLowerCase();
    const titreNormalise = ` ${titreNettoye} `;
    ZoneBourseService.SCORE_REGEXP.forEach(scoreRegexp => {
      if (scoreRegexp.negatif.test(titreNormalise)) {
        score--;
      }
      if (scoreRegexp.positif.test(titreNormalise)) {
        score++;
      }
    });
    return score;
  }

  public chargerLien(pathname: string): Observable<string> {
    return new Observable(observer => {
      if (!pathname.startsWith('/')) {
        pathname = '/' + pathname;
      }
      this.http.get(`/zonebourse${pathname}`, {
        // headers: ZoneBourseService.HEADERS_HTML,
        responseType: 'text'
      }).subscribe({
        error: httpErrorResponse => {
          observer.error(httpErrorResponse);
          observer.complete();
        },
        next: html => {
          observer.next(this.parseArticle(html));
          observer.complete();
        }
      });
    });
  }

  private parseArticle(html: string): string {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const elDIV = document.querySelector('div.article-text');
    if (elDIV) {
      return elDIV.innerHTML;
    }
    return '';
  }
}
