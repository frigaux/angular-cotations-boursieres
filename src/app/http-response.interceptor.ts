import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, delay, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {Router} from '@angular/router';

export const httpResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const DELAY = 500;


  return next(req).pipe(
    delay(DELAY),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case 401:
            router.navigate(['/authentification']);
            break;
          default:
            router.navigate(['/erreur-technique']);
        }
      }
      return throwError(() => error);
    })
  );
};
