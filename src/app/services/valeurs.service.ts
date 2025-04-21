import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DTOValeur } from './DTOValeur';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {

  constructor(private http: HttpClient) { }

  // TODO : intercepteur avec ajout JWT, modif url et headers
  public getValeurs(): Observable<DTOValeur[]> {
    return new Observable(observer => {
      this.http.get<DTOValeur[]>(
        'bourse/valeurs'
      ).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: valeurs => {
          observer.next(valeurs);
          observer.complete();
        }
      });
    });

  }
}
