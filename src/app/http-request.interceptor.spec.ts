import {TestBed} from '@angular/core/testing';
import {HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse} from '@angular/common/http';

import {AUTHENTIFICATION_REQUISE, httpRequestInterceptor} from './http-request.interceptor';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {AuthentificationService} from './services/authentification/authentification.service';

describe('httpRequestInterceptor', () => {
  let interceptor: HttpInterceptorFn;
  let router: jasmine.SpyObj<Router>;
  let mockRequest: HttpRequest<unknown>;
  let mockHandler: jasmine.Spy<HttpHandlerFn>;
  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['isAuthentifie', 'getJwt']);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: router},
        {provide: AuthentificationService, useValue: mockAuthentificationService}
      ]
    });

    // Get the interceptor instance
    interceptor = (req, next) =>
      TestBed.runInInjectionContext(() => httpRequestInterceptor(req, next));

    // Create a mock request
    mockRequest = new HttpRequest('GET', '/api/test');

    // Create a mock handler
    mockHandler = jasmine.createSpy();

  });

  it('should be created', () => {
    expect(interceptor).toBeInstanceOf(Function);
  });

  describe('Given une ressource non protégée', () => {
    const expectedResponse = new HttpResponse({status: 200, body: {data: 'test'}});

    beforeEach(() => {
      mockRequest.context.set(AUTHENTIFICATION_REQUISE, false);
      mockHandler.and.returnValue(of(expectedResponse));
    });

    it('when on appelle simplement la ressource then elle doit renvoyer une réponse 200', (done) => {
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
  });

  describe('Given une ressource protégée sans être authentifié', () => {
    const expectedResponse = new HttpResponse({status: 200, body: {data: 'test'}});

    beforeEach(() => {
      mockHandler.and.returnValue(of(expectedResponse));
      mockAuthentificationService.isAuthentifie.and.returnValue(false);
    });

    it('when on passe par l\'intercepteur then on route vers authentification', (done) => {
      interceptor(mockRequest, mockHandler).subscribe({
        next: () => done.fail('should route vers authentification'),
        error: (error) => {
          expect(error).toBeInstanceOf(String);
          expect(router.navigate).toHaveBeenCalledWith(['/authentification']);
          done();
        }
      });
    });
  });

  describe('Given une ressource protégée en étant authentifié', () => {
    const expectedResponse = new HttpResponse({status: 200, body: {data: 'test'}});
    const jwt = 'token';

    beforeEach(() => {
      mockHandler.and.returnValue(of(expectedResponse));
      mockAuthentificationService.isAuthentifie.and.returnValue(true);
      mockAuthentificationService.getJwt.and.returnValue(jwt);
    });

    it('when on passe par l\'intercepteur then la ressource est appelée avec ajout du header Authorization', (done) => {
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
  });
});
