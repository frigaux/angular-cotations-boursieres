import {TestBed} from '@angular/core/testing';

import {CoursService} from './cours.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {DTOListeCours} from './DTOListeCours';
import {DTOCoursTicker} from './DTOCoursTicker';
import {DTOCoursTickerLight} from './DTOCoursTickerLight';
import {LISTE_COURS, COURS_TICKER, LISTE_COURS_TICKER_LIGHT} from '../jdd/JDDCours';

describe('CoursService', () => {
  let coursService: CoursService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(
          []
        )
      ],
      providers: [
        CoursService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    coursService = TestBed.inject(CoursService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(coursService).toBeTruthy();
  });

  it('#chargerCours doit renvoyer le dernier cours pour chaque valeur', async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP de récupération des cours
    const promiseCours: Promise<DTOListeCours> = firstValueFrom(coursService.chargerCours());
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/cours',
    }).flush(LISTE_COURS);
    expect(await promiseCours).toEqual(LISTE_COURS);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });

  it('#chargerCoursTicker doit renvoyer le dernier cours pour le ticker', async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP de récupération des cours
    const promiseCours: Promise<DTOCoursTicker> = firstValueFrom(coursService.chargerCoursTicker('GLE'));
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/cours/GLE',
    }).flush(COURS_TICKER);
    expect(await promiseCours).toEqual(COURS_TICKER);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });

  it('#chargerCoursTickerWithLimit doit renvoyer les n dernier cours pour le ticker', async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP de récupération des cours
    const promiseCours: Promise<DTOCoursTickerLight[]> = firstValueFrom(coursService.chargerCoursTickerWithLimit('GLE', 2));
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/cours/GLE/2',
    }).flush(LISTE_COURS_TICKER_LIGHT);
    expect(await promiseCours).toEqual(LISTE_COURS_TICKER_LIGHT);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });
});
