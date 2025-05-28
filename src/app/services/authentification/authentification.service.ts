import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { DTOJwt } from './dto-jwt.interface';
import { Observable } from 'rxjs';
import { AUTHENTIFICATION_REQUISE } from '../../http-request.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  static readonly JWT = 'jwt';
  private jwt: string | undefined;
  private jwtPayload: JwtPayload | undefined;

  constructor(private http: HttpClient) { }

  public isAuthentifie(): boolean {
    if (!this.jwtPayload) {
      this.initFromLocalStorage();
    }
    return !this.isExpire();
  }

  public reinitialiser(): void {
    this.jwt = undefined;
    this.jwtPayload = undefined;
    window.localStorage.removeItem(AuthentificationService.JWT);
  }

  public authentifier(): Observable<DTOJwt> {
    return new Observable(observer => {
      this.http.post<DTOJwt>(
        'bourse/authentification',
        { identifiant: 'anonymous', motDePasse: 'anonymous' },
        { context: new HttpContext().set(AUTHENTIFICATION_REQUISE, false) }
      ).subscribe({
        error: httpResponseError => {
          observer.error(httpResponseError);
          observer.complete();
        },
        next: jwt => {
          window.localStorage.setItem(AuthentificationService.JWT, jwt.jwt);
          this.jwt = jwt.jwt;
          this.jwtPayload = jwtDecode(jwt.jwt);
          observer.next(jwt);
          observer.complete();
        }
      });
    });
  }

  public getJwt(): string | undefined {
    return this.jwt;
  }

  private initFromLocalStorage(): void {
    const token = window.localStorage.getItem(AuthentificationService.JWT);
    if (token) {
      this.jwt = token;
      this.jwtPayload = jwtDecode(token);
    }
  }

  private isExpire(): boolean {
    if (this.jwtPayload) {
      if (Date.now() < this.jwtPayload.exp! * 1000) {
        return false;
      }
      this.reinitialiser();
    }
    return true;
  }
}
