import {TestBed} from '@angular/core/testing';

import {AuthentificationService} from './authentification.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {lastValueFrom} from 'rxjs';

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
      url: 'bourse/authentification',
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
      url: 'bourse/authentification',
    }).error(new ProgressEvent(''));
    // on attend la résolution de la promise et on ignore l'erreur volontaire
    try {
      await promiseAuthentifier;
    } catch {
      // erreur attendue lors de l'authentification: on la neutralise pour ne pas polluer la console des tests
    }
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthentificationService,
        provideHttpClient(),
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
      requestAndMokeAuthentifier('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDMwMDU4ODUsImlhdCI6MTc0MzAwNTgyNSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.zFNfQX4OkP84FRlINOFiPABEsKBzoixJ7L_4AfXdy98nhdzepORBTOl4ClqtAzVlXX__Xbdf-GCCA9TtU5lsRQ');
    });

    it('#isAuthentifie doit renvoyer false', () => {
      expect(authentificationService.isAuthentifie()).toBe(false);
    });
  });

  describe('Given est authentifié avec un JWT valide', () => {
    beforeEach(() => {
      authentificationService.reinitialiser();
      // JWT anonyme avec validité quasi illimitée
      // ahahaha ! vous pensiez que c'était un vrai jeton ?
      requestAndMokeAuthentifier('eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ4OTY2MDU5NDUsImlhdCI6MTc0MzAwNTk0NSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.4KvXcysGt5JykHhhZW9qh9a4kFirx2Mjj-8nIFgCl35Dz8u6D8VpzWd0gtwBJWTZtNvx8nyYU9HtB-cOrMu2IQ');
    });

    it('#isAuthentifie doit renvoyer true', () => {
      expect(authentificationService.isAuthentifie()).toBe(true);
      expect(authentificationService.getJwt()).toBeDefined();
    });
  });


  describe('Given n\'est pas authentifié mais le localStorage contient un JWT valide', () => {
    beforeEach(() => {
      authentificationService.reinitialiser();
      // JWT anonyme avec validité quasi illimitée
      // ahahaha ! vous pensiez que c'était un vrai jeton ?
      window.localStorage.setItem(AuthentificationService.JWT, 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjQ4OTY2MDU5NDUsImlhdCI6MTc0MzAwNTk0NSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.4KvXcysGt5JykHhhZW9qh9a4kFirx2Mjj-8nIFgCl35Dz8u6D8VpzWd0gtwBJWTZtNvx8nyYU9HtB-cOrMu2IQ');
    });

    it('#isAuthentifie doit renvoyer true', () => {
      expect(authentificationService.isAuthentifie()).toBe(true);
    });
  });
});
