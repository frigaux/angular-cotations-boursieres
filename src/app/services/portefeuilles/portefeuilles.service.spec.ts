import {PortefeuillesService} from './portefeuilles.service';
import {PORTEFEUILLES} from '../jdd/jdd-portefeuille.dataset';
import {DTOPortefeuille} from '../../components/portefeuilles/gestion-portefeuilles/dto-portefeuille.interface';
import {TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('PortefeuillesService', () => {
  let service: PortefeuillesService;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));

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
    service.enregistrer(clonePORTEFEUILLES());
    expect(service.charger()).toEqual(PORTEFEUILLES);
  });

  it('Given des portefeuilles when #enregistrer then #auMoinsUnPortefeuilleCorrectementConfigure renvoie true', () => {
    service.enregistrer(clonePORTEFEUILLES());
    expect(service.auMoinsUnPortefeuilleCorrectementConfigure()).toEqual(true);
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
      expect(service.import("{\"nom_\": \"CAC40\", \"parDefaut\": true, \"tickers\": [], \"alertes\": []}"))
        .toBe('SERVICES.PORTEFEUILLES.ERREURS.TABLEAU_REQUIS');
      expect(service.import("[{\"nom_\": \"CAC40\", \"parDefaut\": true, \"tickers\": [], \"alertes\": []}]"))
        .toBe('SERVICES.PORTEFEUILLES.ERREURS.NOM_REQUIS');
      expect(service.import("[{\"nom\": \"CAC40\", \"parDefaut_\": true, \"tickers\": [], \"alertes\": []}]"))
        .toBe('SERVICES.PORTEFEUILLES.ERREURS.PAR_DEFAUT_REQUIS');
      expect(service.import("[{\"nom\": \"CAC40\", \"parDefaut\": true, \"tickers_\": [], \"alertes\": []}]"))
        .toBe('SERVICES.PORTEFEUILLES.ERREURS.TICKERS_REQUIS');
      expect(service.import("[{\"nom\": \"CAC40\", \"parDefaut\": true, \"tickers\": [], \"alertes_\": []}]"))
        .toBe('SERVICES.PORTEFEUILLES.ERREURS.ALERTES_REQUIS');
      expect(service.import("[{\"nom\": \"CAC40\", \"parDefaut\": false, \"tickers\": [], \"alertes\": []}]"))
        .toBe('SERVICES.PORTEFEUILLES.ERREURS.UN_SEUL_PAR_DEFAUT');
      expect(resultatImport).toEqual(undefined);
    });

    it('when #import des portefeuilles valides then #export renvoie les portefeuilles', () => {
      expect(service.import(portefeuilles)).toBeUndefined();
      expect(resultatImport).toEqual(PORTEFEUILLES);
      expect(service.export()).toEqual(portefeuilles);
    });
  });
});
