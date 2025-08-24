import {HttpContextToken, HttpEvent, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AuthentificationService} from './services/authentification/authentification.service';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';

export const AUTHENTIFICATION_REQUISE = new HttpContextToken<boolean>(() => true);

// https://angular.dev/guide/http/interceptors
export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  if (isRequeteProxy(req.url)) {
    return makeProxyCall(req, next);
  } else {
    return makeApiCall(req, next);
  }
};

function isRequeteProxy(pathname: string): boolean {
  return pathname.startsWith('/abcbourse');
}

function makeProxyCall(req: HttpRequest<unknown>, next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>) {
  return next(req.clone({url: environment.staticPrefixUrl + req.url}));
}

function makeApiCall(req: HttpRequest<unknown>, next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>) {
  const authentificationRequise = req.context.get(AUTHENTIFICATION_REQUISE);
  const updateRequest = {
    url: environment.apiPrefixUrl + '/v' + environment.apiVersion + req.url,
    headers: req.headers
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json'),
  };
  if (authentificationRequise) {
    const authentificationService = inject(AuthentificationService);
    if (authentificationService.isAuthentifie()) {
      updateRequest.headers = updateRequest.headers.append('Authorization', 'Bearer ' + authentificationService.getJwt());
      return next(req.clone(updateRequest));
    } else {
      inject(Router).navigate(['/authentification']);
      return throwError(() => 'pas authentifié, routage vers authentification');
    }
  } else {
    return next(req.clone(updateRequest));
  }
}
