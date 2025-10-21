import {TestBed} from '@angular/core/testing';

import {ParametrageService} from './parametrage.service';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../valeurs/valeurs.service';
import {CoursService} from '../cours/cours.service';
import {PortefeuillesService} from '../portefeuilles/portefeuilles.service';
import {TableauxService} from '../tableaux/tableaux.service';

// Généré par Junie le 19/09/2025
describe('ParametrageService', () => {
  let service: ParametrageService;
  let httpTesting: HttpTestingController;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerAchats', 'enregistrerAchats']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerFiltres', 'enregistrerFiltres']);
  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'enregistrer']);
  const mockTableauxService = jasmine.createSpyObj('TableauxService', ['charger', 'enregistrer']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(
          []
        ),
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        {provide: TableauxService, useValue: mockTableauxService},
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ParametrageService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('Given le localStorage mocké', () => {
    let mockLocalStorage: Record<string, string>;

    beforeEach(() => {
      mockLocalStorage = {};
      spyOn(window.localStorage, 'getItem').and.callFake(
        (key: string) => mockLocalStorage[key] || null
      );
      spyOn(window.localStorage, 'setItem').and.callFake(
        (key: string, value: string) => mockLocalStorage[key] = value
      );
    });

    it('when #chargerUrlSauvegardeRestauration then undefined', () => {
      expect(service.chargerUrlSauvegardeRestauration()).toBeUndefined();
    });

    it('when #enregistrerUrlSauvegardeRestauration then #chargerUrlSauvegardeRestauration renvoie la valeur enregistrée', () => {
      service.enregistrerUrlSauvegardeRestauration('ma-cle');
      expect(service.chargerUrlSauvegardeRestauration()).toBe('ma-cle');
    });
  });
});
