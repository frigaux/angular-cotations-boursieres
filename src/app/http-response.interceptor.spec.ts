import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';

import {httpResponseInterceptor} from './http-response.interceptor';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';

describe('httpResponseInterceptor', () => {
  let interceptor: HttpInterceptorFn;
  let router: jasmine.SpyObj<Router>;
  let mockRequest: HttpRequest<unknown>;
  let mockHandler: jasmine.Spy<HttpHandlerFn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: router}
      ]
    });

    // Get the interceptor instance
    interceptor = (req, next) =>
      TestBed.runInInjectionContext(() => httpResponseInterceptor(req, next));

    // Create a mock request
    mockRequest = new HttpRequest('GET', '/api/test');

    // Create a mock handler
    mockHandler = jasmine.createSpy();

  });

  it('should be created', () => {
    expect(interceptor).toBeInstanceOf(Function);
  });

  it('Given une ressource qui renvoie 200 when on l\'appelle then le résultat est renvoyé tel quel', (done) => {
    const expectedResponse = new HttpResponse({status: 200, body: {data: 'test'}});
    mockHandler.and.returnValue(of(expectedResponse));

    interceptor(mockRequest, mockHandler).subscribe({
      next: (response) => {
        expect(response).toBeInstanceOf(HttpResponse);
        expect(response).toEqual(expectedResponse);
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      },
      error: done.fail
    });
  });


  it('Given une ressource qui renvoie 401 when on l\'appelle then on route vers authentification', (done) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Unauthorized',
      status: 401,
      statusText: 'Unauthorized'
    });

    mockHandler.and.returnValue(throwError(() => errorResponse));

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('should have failed with 401 error'),
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.status).toBe(401);
        expect(router.navigate).toHaveBeenCalledWith(['/authentification']);
        done();
      }
    });
  });

  it('Given une ressource qui ne renvoie pas 200 ou 401 when on l\'appelle then on route vers erreur-technique', (done) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Not Found',
      status: 404,
      statusText: 'Not Found'
    });

    mockHandler.and.returnValue(throwError(() => errorResponse));

    interceptor(mockRequest, mockHandler).subscribe({
      next: () => done.fail('should have failed with 404 error'),
      error: (error) => {
        expect(error).toBeInstanceOf(HttpErrorResponse);
        expect(error.status).toBe(404);
        expect(router.navigate).toHaveBeenCalledWith(['/erreur-technique']);
        done();
      }
    });
  });
});
