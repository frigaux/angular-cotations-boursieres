import {TestBed} from '@angular/core/testing';

import {ValeursService} from './valeurs.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {firstValueFrom} from 'rxjs';
import {DTOValeur} from './DTOValeur';
import {RouterModule} from '@angular/router';
import {VALEURS} from '../jdd/JDDValeur';

describe('ValeursService', () => {
  let valeursService: ValeursService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(
          []
        )
      ],
      providers: [
        ValeursService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    valeursService = TestBed.inject(ValeursService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(valeursService).toBeTruthy();
  });

  it('#chargerValeurs doit renvoyer les valeurs', async () => {
    // 1 - création d'une promesse sur l'observable qui fait la requête HTTP de récupération des valeurs
    const promiseValeurs: Promise<DTOValeur[]> = firstValueFrom(valeursService.chargerValeurs());
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/valeurs',
    }).flush(VALEURS);
    expect(await promiseValeurs).toEqual(VALEURS);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();

    // 2 - création d'une promesse sur l'observable qui récupère les valeurs dans le cache
    const promiseValeursCache: Promise<DTOValeur[]> = firstValueFrom(valeursService.chargerValeurs());
    expect(await promiseValeursCache).toEqual(VALEURS);
  });
});
