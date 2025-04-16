import { TestBed } from '@angular/core/testing';

import { AuthentificationService } from './authentification.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

describe('AuthentificationService', () => {
  let authentificationService: AuthentificationService;
  let httpTesting: HttpTestingController;

  // https://angular.dev/guide/http/testing
  let requestAndMokeAuthentifier = async (jwt: string) => {
    // création d'une promesse sur l'observable qui fait la requête HTTP d'authentification
    const promiseAuthentifier = lastValueFrom(authentificationService.authentifier());
    // bouchonnage de la ressource HTTP
    const req = httpTesting.expectOne({
      method: 'POST',
      url: environment.apiUrl + '/v1/bourse/authentification',
    }).flush({ jwt });
    // on attend la résolution de la promise
    await promiseAuthentifier;
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthentificationService,
        provideHttpClient(),
        provideHttpClientTesting()
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

  describe('Given est authentifié avec un JWT expiré', () => {
    beforeEach(() => {
      requestAndMokeAuthentifier('eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NDMwMDU4ODUsImlhdCI6MTc0MzAwNTgyNSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.O6-l5v3xeD1ZozJJxRdofAS6dCvG2VCQLVh8KRuJ_fTCkYaWTbvhlB-w5ON8Fw01baZHDIe1ndGFOgQjMXI6fA');
    });

    it('#isAuthentifie doit renvoyer false', () => {
      expect(authentificationService.isAuthentifie()).toBe(false);
    });
  });

  describe('Given  est authentifié avec un JWT valide', () => {
    beforeEach(() => {
      requestAndMokeAuthentifier('eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjQ4OTY2MDU5NDUsImlhdCI6MTc0MzAwNTk0NSwiaWRlbnRpZmlhbnQiOiJhbm9ueW1vdXMifQ.xr0mjZ2cYZ89slsif4-Kg923jB4dFstZhzaOdZnM_gKo99MrhkJIiOUPXecanpzBDhTMsOwFK6W-zSv176vjOA');
    });

    it('#isAuthentifie doit renvoyer true', () => {
      expect(authentificationService.isAuthentifie()).toBe(true);
    });
  });
});
