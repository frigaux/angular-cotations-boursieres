import {TestBed} from '@angular/core/testing';

import {CoursService} from './cours.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {AuthentificationComponent} from '../../components/authentification/authentification.component';
import {provideHttpClient} from '@angular/common/http';
import {AuthentificationService} from '../authentification/authentification.service';
import {firstValueFrom} from 'rxjs';
import {DTOListeCours} from './DTOListeCours';

describe('CoursService', () => {
  let coursService: CoursService;
  let httpTesting: HttpTestingController;

  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['isAuthentifie', 'getJwt']);
  const cours: DTOListeCours = {
    "date": new Date("2025-05-02"),
    "cours": [
      {
        "ticker": "GLE",
        "ouverture": 45.5,
        "plusHaut": 46.64,
        "plusBas": 45.31,
        "cloture": 46.46,
        "volume": 4136174,
        "moyennesMobiles": [
          46.46,
          46.03
        ],
        "alerte": true
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(
          [{path: 'authentification', component: AuthentificationComponent}]
        )
      ],
      providers: [
        CoursService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {provide: AuthentificationService, useValue: mockAuthentificationService}
      ]
    });
    coursService = TestBed.inject(CoursService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(coursService).toBeTruthy();
  });

  describe('Given est authentifié', () => {
    beforeEach(() => {
      mockAuthentificationService.isAuthentifie.and.returnValue(true);
    });

    it('#getCours doit renvoyer le dernier cours pour chaque valeur', async () => {
      // création d'une promesse sur l'observable qui fait la requête HTTP d'authentification
      const promiseCours: Promise<DTOListeCours> = firstValueFrom(coursService.getCours());
      // bouchonnage de la ressource HTTP
      httpTesting.expectOne({
        method: 'GET',
        url: 'bourse/cours',
      }).flush(cours);
      expect(await promiseCours).toEqual(cours);
      // vérification qu'il n'y a pas de requêtes en attente
      httpTesting.verify();
    });
  });
});
