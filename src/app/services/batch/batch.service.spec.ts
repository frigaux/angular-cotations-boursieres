import {TestBed} from '@angular/core/testing';

import {BatchService} from './batch.service';
import {ValeursService} from '../valeurs/valeurs.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {provideHttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {DTO_BATCHS} from '../jdd/jdd-batch.dataset';
import {DTOJobInstance} from './dto-job-instance.interface';

describe('BatchService', () => {
  let batchService: BatchService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        TranslateModule.forRoot({})
      ],
      providers: [
        ValeursService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    batchService = TestBed.inject(BatchService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(batchService).toBeTruthy();
  });

  it('#chargerDernieresExecutions doit renvoyer les derniers batchs', async () => {
    // 1 - création d'une promesse sur l'observable qui fait la requête HTTP
    const promiseDerniereExecution: Promise<DTOJobInstance[]> = firstValueFrom(batchService.chargerDernieresExecutions());
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: '/bourse/jobs?jobNames=jobMajAbcLibelles,jobMajAbcCotations,jobMajBoursoramaCours,jobConvertirEnValeurCours,jobCalculerMoyennes',
    }).flush(DTO_BATCHS);
    expect(await promiseDerniereExecution).toEqual(DTO_BATCHS);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });
});
