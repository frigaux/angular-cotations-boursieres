import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DTOValeur} from './DTOValeur';
import {map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {
  private valeurs: DTOValeur[] | undefined;

  constructor(private http: HttpClient) {
  }

  public chargerValeurs(): Observable<DTOValeur[]> {
    if (this.valeurs) {
      return of(this.valeurs);
    } else {
      return this.http.get<DTOValeur[]>(
        'bourse/valeurs'
      ).pipe(map(valeurs => this.valeurs = valeurs));
    }
  }
}
