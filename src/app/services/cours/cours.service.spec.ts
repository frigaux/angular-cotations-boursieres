import {TestBed} from '@angular/core/testing';

import {CoursService} from './cours.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {provideHttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {DTOListeCours} from './DTOListeCours';
import {DTOCoursTicker} from './DTOCoursTicker';
import {DTOCoursTickerLight} from './DTOCoursTickerLight';

describe('CoursService', () => {
  let coursService: CoursService;
  let httpTesting: HttpTestingController;

  const cours: DTOListeCours = {
    "date": new Date("2025-05-09"),
    "cours": [
      {
        "ticker": "GLE",
        "ouverture": 46.23,
        "plusHaut": 46.82,
        "plusBas": 46.06,
        "cloture": 46.8,
        "volume": 2141570,
        "moyennesMobiles": [
          46.8,
          46.68
        ],
        "alerte": true
      }
    ]
  };

  const coursTicker: DTOCoursTicker = {
    "date": new Date("2025-05-09"),
    "ouverture": 46.23,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.8,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ],
    "alerte": true
  };

  const coursTickerLights: DTOCoursTickerLight[] = [
    {
      "date": new Date("2025-05-09"),
      "cloture": 46.23,
      "volume": 2141570,
      "alerte": true
    },
    {
      "date": new Date("2025-05-08"),
      "cloture": 45.7,
      "volume": 2047911,
      "alerte": true
    }
  ];

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
    }).flush(cours);
    expect(await promiseCours).toEqual(cours);
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
    }).flush(coursTicker);
    expect(await promiseCours).toEqual(coursTicker);
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
    }).flush(coursTickerLights);
    expect(await promiseCours).toEqual(coursTickerLights);
    // vérification qu'il n'y a pas de requêtes en attente
    httpTesting.verify();
  });
});
