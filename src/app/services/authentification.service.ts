import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { DTOJwt } from './DTOJwt';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  public jwt!: JwtPayload;

  constructor(private http: HttpClient) { }

  public isAuthentifie(): boolean {
    if (this.jwt) {
      return Date.now() < this.jwt.exp! * 1000;
    }
    return false;
  }

  public authentifier(): Observable<void> {
    return new Observable(observer => {
      this.http.post<DTOJwt>(
        environment.apiUrl + '/v1/bourse/authentification',
        { identifiant: 'anonymous', motDePasse: 'anonymous' },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      ).subscribe(jwt => {
        this.jwt = jwtDecode(jwt.jwt);
        observer.complete();
      });
    });
  }
}
