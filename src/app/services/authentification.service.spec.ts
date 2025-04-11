import { TestBed } from '@angular/core/testing';

import { AuthentificationService } from './authentification.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthentificationService', () => {
  let authentificationService: AuthentificationService;
  let httpTesting: HttpTestingController;

  let requestAndMokeAuthentifier = (jwt: string) => {
    // appel du service qui dépend d'une ressource HTTP
    authentificationService.authentifier().subscribe();
    // bouchonnage de la ressource HTTP
    const req = httpTesting.expectOne({
      method: 'POST',
      url: environment.apiUrl + '/v1/bourse/authentification',
    }).flush({ jwt });
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
