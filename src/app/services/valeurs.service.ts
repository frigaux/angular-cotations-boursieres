import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DTOValeur } from './DTOValeur';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {

  constructor(private http: HttpClient) { }

  // TODO : intercepteur avec ajout JWT, modif url et headers
  public getValeurs(): Observable<DTOValeur[]> {
    return new Observable(observer => {
      this.http.get<DTOValeur[]>(
        environment.apiUrl + '/v' + environment.apiVersion + '/bourse/valeurs',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
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
