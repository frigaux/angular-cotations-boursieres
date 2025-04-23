import { TestBed } from '@angular/core/testing';

import { ValeursService } from './valeurs.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthentificationService } from './authentification.service';
import { httpRequestInterceptor } from '../http-request.interceptor';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DTOValeur } from './DTOValeur';
import { RouterModule } from '@angular/router';
import { AuthentificationComponent } from '../components/authentification/authentification.component';

describe('ValeursService', () => {
  let valeursService: ValeursService;
  let httpTesting: HttpTestingController;
  let result: DTOValeur[];

  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['isAuthentifie', 'getJwt']);
  const valeurs: DTOValeur[] = [{
    "ticker": "GLE",
    "marche": "EURO_LIST_A",
    "libelle": "Societe Generale"
  }];

  let noValueFrom = (source: Observable<DTOValeur[]>) => {
    return new Promise<undefined>((resolve, reject) => {
      source.subscribe({
        complete: () => {
          resolve(undefined);
        }
      });
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(
          [{ path: 'authentification', component: AuthentificationComponent }]
        )
      ],
      providers: [
        ValeursService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])
        ),
        provideHttpClientTesting(),
        { provide: AuthentificationService, useValue: mockAuthentificationService }
      ]
    });
    valeursService = TestBed.inject(ValeursService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(valeursService).toBeTruthy();
  });

  describe('Given est authentifié', () => {
    beforeEach(() => {
      mockAuthentificationService.isAuthentifie.and.returnValue(true);
    });

    it('#getValeurs doit renvoyer les valeurs', async () => {
      // création d'une promesse sur l'observable qui fait la requête HTTP d'authentification
      const promiseValeurs: Promise<DTOValeur[]> = firstValueFrom(valeursService.getValeurs());
      // bouchonnage de la ressource HTTP
      httpTesting.expectOne({
        method: 'GET',
        url: environment.apiUrl + '/v1/bourse/valeurs',
      }).flush(valeurs);
      expect(await promiseValeurs).toEqual(valeurs);
      // vérification qu'il n'y a pas de requêtes en attente
      httpTesting.verify();
    });
  });

  describe('Given n\'est pas authentifié', () => {
    beforeEach(() => {
      mockAuthentificationService.isAuthentifie.and.returnValue(false);
    });

    it('#getValeurs ne renvoie rien', async () => {
      const promiseValeurs: Promise<undefined> = noValueFrom(valeursService.getValeurs());
      expect(await promiseValeurs).toEqual(undefined);
    });
  });
});
