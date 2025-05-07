import {TestBed} from '@angular/core/testing';

import {ValeursService} from './valeurs.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AuthentificationService} from '../authentification/authentification.service';
import {firstValueFrom} from 'rxjs';
import {DTOValeur} from './DTOValeur';
import {RouterModule} from '@angular/router';
import {AuthentificationComponent} from '../../components/authentification/authentification.component';
import {Marche} from './marche';

describe('ValeursService', () => {
  let valeursService: ValeursService;
  let httpTesting: HttpTestingController;

  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['isAuthentifie', 'getJwt']);
  const valeurs: DTOValeur[] = [{
    "ticker": "GLE",
    "marche": Marche.EURO_LIST_A,
    "libelle": "Societe Generale"
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(
          [{path: 'authentification', component: AuthentificationComponent}]
        )
      ],
      providers: [
        ValeursService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: AuthentificationService, useValue: mockAuthentificationService}
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

    it('#chargerValeurs doit renvoyer les valeurs', async () => {
      // 1 - création d'une promesse sur l'observable qui fait la requête HTTP de récupération des valeurs
      const promiseValeurs: Promise<DTOValeur[]> = firstValueFrom(valeursService.chargerValeurs());
      // bouchonnage de la ressource HTTP
      httpTesting.expectOne({
        method: 'GET',
        url: 'bourse/valeurs',
      }).flush(valeurs);
      expect(await promiseValeurs).toEqual(valeurs);
      // vérification qu'il n'y a pas de requêtes en attente
      httpTesting.verify();

      // 2 - création d'une promesse sur l'observable qui récupère les valeurs dans le cache
      const promiseValeursCache: Promise<DTOValeur[]> = firstValueFrom(valeursService.chargerValeurs());
      expect(await promiseValeursCache).toEqual(valeurs);
    });
  });
});
