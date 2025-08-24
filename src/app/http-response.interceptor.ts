import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, delay, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';

export const httpResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    delay(environment.httpDelay),
    catchError((error: unknown) => {
      if (isRequeteApi(req.url)) {
        handleApiError(error, router);
      }
      return throwError(() => error);
    })
  );
};

function isRequeteApi(url: string): boolean {
  return !new URL(url).pathname.startsWith('/abcbourse');
}

function handleApiError(error: unknown, router: Router) {
  if (error instanceof HttpErrorResponse) {
    switch (error.status) {
      case 401:
        router.navigate(['/authentification']);
        break;
      default:
        router.navigate(['/erreur-technique'], {
          queryParams: {message: `${error.message}`}
        });
    }
  }
}
