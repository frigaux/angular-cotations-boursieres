import { TestBed } from '@angular/core/testing';

import { AuthentificationService } from './authentification.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { httpRequestInterceptor } from '../http-request.interceptor';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

describe('AuthentificationService', () => {
  let authentificationService: AuthentificationService;
  let httpTesting: HttpTestingController;

  // const httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

  // https://angular.dev/guide/http/testing
  let requestAndMokeAuthentifier = async (jwt: string) => {
    // création d'une promesse sur l'observable qui fait la requête HTTP d'authentification
    const promiseAuthentifier = lastValueFrom(authentificationService.authentifier());
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'POST',
      url: environment.apiUrl + '/v1/bourse/authentification',
    }).flush({ jwt });
    // on attend la résolution de la promise
    await promiseAuthentifier;
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();

    // // bouchonnage de la ressource HTTP
    // httpClientSpy.post.and.returnValue(new Observable(observer => observer.next({ jwt })));
    // // appel du service qui dépend d'une ressource HTTP
    // await lastValueFrom(authentificationService.authentifier());
  }

  let requestAndMokeAuthentifierWithError = async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP d'authentification
    const promiseAuthentifier = lastValueFrom(authentificationService.authentifier());
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'POST',
      url: environment.apiUrl + '/v1/bourse/authentification',
    }).error(new ProgressEvent(''));
    // on attend la résolution de la promise
    await promiseAuthentifier;
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthentificationService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])// TODO : remove !
        ),
        provideHttpClientTesting(),
        // { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    authentificationService = TestBed.inject(AuthentificationService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  describe('Given n\'est pas authentifié', () => {
    beforeEach(() => {
      authentificationService.reinitialiser();
    });

    it('#isAuthentifie doit renvoyer false', () => {
      expect(authentificationService.isAuthentifie()).toBe(false);
    });
  });

  // log une erreur : "context.js:265 HttpErrorResponse"
  describe('Given l\'authentification a échoué', () => {
    beforeEach(() => {
      authentificationService.reinitialiser();
      requestAndMokeAuthentifierWithError();
    });

    it('#isAuthentifie doit renvoyer false', () => {
      expect(authentificationService.isAuthentifie()).toBe(false);
    });
  });

  describe('Given est authentifié avec un JWT expiré', () => {
    beforeEach(() => {
      authentificationService.reinitialiser();
      // JWT anonyme expiré
      requestAndMokeAuthentifier('eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NDMwMDU4ODUsImlhdCI6MTc0MzAwNTgyNSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.O6-l5v3xeD1ZozJJxRdofAS6dCvG2VCQLVh8KRuJ_fTCkYaWTbvhlB-w5ON8Fw01baZHDIe1ndGFOgQjMXI6fA');
    });

    it('#isAuthentifie doit renvoyer false', () => {
      expect(authentificationService.isAuthentifie()).toBe(false);
    });
  });

  describe('Given est authentifié avec un JWT valide', () => {
    beforeEach(() => {
      authentificationService.reinitialiser();
      // JWT anonyme avec validité quasi illimitée
      // ATTENTION ! ne surtout pas exposer un vrai jeton avec accès illimité dans ce test le jour où l'authentification sera en place !
      requestAndMokeAuthentifier('eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjQ4OTY2MDU5NDUsImlhdCI6MTc0MzAwNTk0NSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.xr0mjZ2cYZ89slsif4-Kg923jB4dFstZhzaOdZnM_gKo99MrhkJIiOUPXecanpzBDhTMsOwFK6W-zSv176vjOA');
    });

    it('#isAuthentifie doit renvoyer true', () => {
      expect(authentificationService.isAuthentifie()).toBe(true);
      expect(authentificationService.getJwt()).toBeDefined();
    });
  });

  // TODO : localStorage pas testé !
});
