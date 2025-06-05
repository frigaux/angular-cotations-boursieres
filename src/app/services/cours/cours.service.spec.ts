import {TestBed} from '@angular/core/testing';

import {CoursService} from './cours.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {DTOListeCours} from './dto-liste-cours.interface';
import {DTOCoursTicker} from './dto-cours-ticker.interface';
import {DTOCoursTickerAllege} from './dto-cours-ticker-allege.interface';
import {
  LISTE_COURS,
  COURS_TICKER,
  LISTE_COURS_TICKER_ALLEGE,
  LISTE_COURS_AVEC_LISTE_ALLEGEE
} from '../jdd/jdd-cours.dataset';
import {DtoCoursAvecListeAllege} from './dto-cours-avec-liste-allege.interface';

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

  it('#chargerCoursTickerWithLimit doit renvoyer les n derniers cours pour le ticker', async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP de récupération des cours
    const promiseCours: Promise<DTOCoursTickerAllege[]> = firstValueFrom(coursService.chargerCoursTickerWithLimit('GLE', 2));
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/cours/GLE/2',
    }).flush(LISTE_COURS_TICKER_ALLEGE);
    expect(await promiseCours).toEqual(LISTE_COURS_TICKER_ALLEGE);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });

  it('when #chargerCoursTickersWithLimit appelé sans ticker then doit renvoyer un tableau vide', async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP de récupération des cours
    const promiseCours: Promise<DtoCoursAvecListeAllege[]> = firstValueFrom(coursService.chargerCoursTickersWithLimit([], 4));
    expect(await promiseCours).toEqual([]);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });

  it('#chargerCoursTickersWithLimit doit renvoyer les n derniers cours pour les tickers', async () => {
    // création d'une promesse sur l'observable qui fait la requête HTTP de récupération des cours
    const promiseCours: Promise<DtoCoursAvecListeAllege[]> = firstValueFrom(coursService.chargerCoursTickersWithLimit(['GLE','BNP'], 4));
    // bouchonnage de la ressource HTTP
    httpTesting.expectOne({
      method: 'GET',
      url: 'bourse/cours/tickers/4?tickers=GLE,BNP',
    }).flush(LISTE_COURS_AVEC_LISTE_ALLEGEE);
    expect(await promiseCours).toEqual(LISTE_COURS_AVEC_LISTE_ALLEGEE);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });
});
