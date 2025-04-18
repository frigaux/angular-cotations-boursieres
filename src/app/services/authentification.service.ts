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
  private static readonly JWT = 'jwt';
  private jwt: JwtPayload | undefined;

  constructor(private http: HttpClient) { }

  public isAuthentifie(): boolean {
    if (!this.jwt) {
      this.jwt = this.fromLocalStorage();
    }
    return !this.isExpired();
  }

  public reinitialiser(): void {
    this.jwt = undefined;
    window.localStorage.removeItem(AuthentificationService.JWT);
  }

  public authentifier(): Observable<DTOJwt> {
    return new Observable(observer => {
      this.http.post<DTOJwt>(
        environment.apiUrl + '/v' + environment.apiVersion + '/bourse/authentification',
        { identifiant: 'anonymous', motDePasse: 'anonymous' },
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
        next: jwt => {
          window.localStorage.setItem(AuthentificationService.JWT, jwt.jwt);
          this.jwt = jwtDecode(jwt.jwt);
          observer.next(jwt);
          observer.complete();
        }
      });
    });
  }

  private fromLocalStorage(): JwtPayload | undefined {
    const token = window.localStorage.getItem(AuthentificationService.JWT);
    if (token) {
      return jwtDecode(token);
    }
    return undefined;
  }

  private isExpired(): boolean {
    if (this.jwt) {
      if (Date.now() < this.jwt.exp! * 1000) {
        return false;
      }
      this.reinitialiser();
    }
    return true;
  }
}
