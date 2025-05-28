import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DTOValeur} from './dto-valeur.interface';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValeursService {

  constructor(private http: HttpClient) {
  }

  public chargerValeurs(): Observable<DTOValeur[]> {
    return this.http.get<DTOValeur[]>(
      'bourse/valeurs'
    );
  }
}
