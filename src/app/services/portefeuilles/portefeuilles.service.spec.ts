import {PortefeuillesService} from './portefeuilles.service';
import {PORTEFEUILLES} from '../jdd/jdd-portefeuille.dataset';
import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';
import {TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('PortefeuillesService', () => {
  let service: PortefeuillesService;

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [
          TranslateModule.forRoot({})
        ],
        providers: [PortefeuillesService]
      });
    service = TestBed.inject(PortefeuillesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Given des portefeuilles when #enregistrer then #charger renvoie les portefeuilles', () => {
    service.enregistrer(PORTEFEUILLES);
    expect(service.charger()).toEqual(PORTEFEUILLES);
  });

  describe('Given #onImport', () => {
    let resultatImport: DTOPortefeuille[] | undefined;
    const portefeuilles = JSON.stringify(PORTEFEUILLES);

    beforeEach(() => {
      resultatImport = undefined;
      service.onImport(portefeuilles => resultatImport = portefeuilles);
    });

    it('when #import du format non JSON then #export renvoie les portefeuilles', () => {
      expect(service.import("+ nimp (")).toBeDefined();
      expect(resultatImport).toEqual(undefined);
    });

    it('when #import un portefeuille invalide then #export renvoie les portefeuilles', () => {
      expect(service.import("[{\"nimp\": \"nimp\"}]")).toBe('SERVICES.PORTEFEUILLES.PORTEFEUILLES_INVALIDES');
      expect(resultatImport).toEqual(undefined);
    });

    it('when #import des portefeuilles valides then #export renvoie les portefeuilles', () => {
      expect(service.import(portefeuilles)).toBeUndefined();
      expect(resultatImport).toEqual(PORTEFEUILLES);
      expect(service.export()).toEqual(portefeuilles);
    });
  });
});
