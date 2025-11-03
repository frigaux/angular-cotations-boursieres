import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {DTOActualitesZoneBourse} from './dto-actualites-zone-bourse.interface';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DTOValeur} from '../valeurs/dto-valeur.interface';

@Injectable({
  providedIn: 'root'
})
export class ZoneBourseService {
  private static readonly HEADERS_HTML = new HttpHeaders()
    .set('Accept', 'text/html')
    .set('Accept-Encoding', 'gzip, deflate')
    .set('Accept-Language', 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7')
    .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36');

  private static readonly SCORE: Array<{ positif: string, negatif: string }> = [
    {positif: 'optimiste', negatif: 'pessimiste'},
    {positif: 'optimisme', negatif: 'pessimisme'},
    {positif: 'positif', negatif: 'negatif'},
    {positif: 'positive', negatif: 'negative'},
    {positif: 'hausse', negatif: 'baisse'},
    {positif: 'rehausse', negatif: 'rabaisse'},
    {positif: 'essor', negatif: 'chute'},
    {positif: 'reprise', negatif: 'rechute'},
    {positif: 'favorable', negatif: 'defavorable'},
    {positif: 'gain', negatif: 'perte'},
    {positif: 'soutenu', negatif: 'ralenti'},
    {positif: 'renforce', negatif: 'degrade'},
    {positif: 'allege', negatif: 'pese'},
    {positif: 'encourageant', negatif: 'decevant'},
    {positif: 'performance', negatif: 'repli'},
    {positif: 'accroit', negatif: 'plonge'},
    {positif: 'conforte', negatif: 'divise'},
    {positif: 'repond', negatif: 'decoit'},
    {positif: 'progres', negatif: 'recul'},
    {positif: 'stabilite', negatif: 'volatilite'},
    {positif: 'remarquable', negatif: 'mediocre'},
    {positif: 'exceptionnel', negatif: 'catastrophique'},
    {positif: 'croissant', negatif: 'decroissant'},
    {positif: 'croissante', negatif: 'decroissante'},
    {positif: 'solide', negatif: 'fragile'},
    {positif: 'progresse', negatif: 'devisse'},
    {positif: 'progresse', negatif: 'decevant'},
    {positif: 'achat', negatif: 'vente'}
  ];

  constructor(private http: HttpClient) {
  }

  public chargerActualites(nombrePages: number, valeurByTicker: Map<string, DTOValeur>): Observable<Array<DTOActualitesZoneBourse>> {
    return new Observable(observer => {
      forkJoin(
        Array.from({length: nombrePages}, (v, i) => i + 1)
          .map(numeroPage =>
            this.http.get(`/zonebourse/actualite-bourse/regions/locales/?p=${numeroPage}`, {
              headers: ZoneBourseService.HEADERS_HTML,
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
          if (resultat.length !== 0) {
            observer.next(resultat);
          } else {
            observer.error({
              message: 'Impossible de récupérer les actualités dans le html',
              error: htmls[0]
            });
          }
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
        const elSpanTicker = elTR.querySelector('span.txt-s1');
        const elSpanDate = elTR.querySelector('span.js-date-relative');
        if (elAs.length === 2 && elSpanTicker && elSpanDate) {
          const date = elSpanDate.innerHTML.trim();
          let ticker = undefined;
          if (valeurByTicker.has(elSpanTicker.innerHTML.trim())) {
            ticker = elSpanTicker.innerHTML.trim();
          }
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
    const sansAccent = titre.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const nettoye = sansAccent
      .replace(/[^\w]/g, ' ')
      .trim()
      .toLowerCase();
    const normalise = ` ${nettoye} `;
    ZoneBourseService.SCORE.forEach(mots => {
      if (nettoye.indexOf(` ${mots.negatif} `) !== -1) {
        score--;
      }
      if (nettoye.indexOf(` ${mots.positif} `) !== -1) {
        score++;
      }
    });
    return score;
  }
}
