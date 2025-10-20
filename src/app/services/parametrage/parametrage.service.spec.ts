import { TestBed } from '@angular/core/testing';

import { ParametrageService } from './parametrage.service';

// Généré par Junie le 19/09/2025
describe('ParametrageService', () => {
  let service: ParametrageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametrageService);
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
