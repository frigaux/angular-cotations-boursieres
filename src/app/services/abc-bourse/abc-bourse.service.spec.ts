import {TestBed} from '@angular/core/testing';

import {AbcBourseService} from './abc-bourse.service';
import {HttpErrorResponse, HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import {DTOInformationsTickerABCBourse} from './dto-informations-ticker-abc-bourse.class';
import {DTOActualites} from './dto-actualites.class';

describe('AbcBourseService', () => {
  let service: AbcBourseService;
  const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({url: 'http://fabienrigaux.freeboxos.fr' + req.url}));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AbcBourseService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])
        )
      ]
    });
    service = TestBed.inject(AbcBourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('given le ticker AI when #chargerInformationsTicker then on doit récupérer les informations pour le ticker', async () => {
    const promiseInformationsTicker: Promise<DTOInformationsTickerABCBourse> = firstValueFrom(service.chargerInformationsTicker('AI'));
    const informationsTicker = await promiseInformationsTicker;
    expect(informationsTicker.ticker).toBe('AI');
    expect(informationsTicker.cotations).toBeDefined();
    expect(informationsTicker.actualites.length).toBeGreaterThan(0);
    expect(informationsTicker.variations.length).toBeGreaterThan(0);
    expect(informationsTicker.dividendes.length).toBeGreaterThan(0);
    expect(informationsTicker.ratios.indicateurs.length).toBeGreaterThan(0);
    expect(informationsTicker.ratios.variationCAC).toBeDefined();
    expect(informationsTicker.ratios.correlationCAC).toBeDefined();
    expect(informationsTicker.ratios.qualiteFinanciere).toBeDefined();

    const promiseActualiteTicker: Promise<string> = firstValueFrom(service.chargerLien(informationsTicker.actualites[0].pathname));
    const actualiteTicker = await promiseActualiteTicker;
    expect(actualiteTicker).toBeDefined();
  });

  it('given le ticker ABVX when #chargerInformationsTicker then on doit récupérer une partie des informations pour le ticker', async () => {
    const promiseInformationsTicker: Promise<DTOInformationsTickerABCBourse> = firstValueFrom(service.chargerInformationsTicker('ABVX'));
    const informationsTicker = await promiseInformationsTicker;
    expect(informationsTicker.ticker).toBe('ABVX');
    expect(informationsTicker.actualites.length).toBeGreaterThan(0);
    expect(informationsTicker.variations.length).toBeGreaterThan(0);
    expect(informationsTicker.dividendes.length).toBe(0);
    expect(informationsTicker.ratios.indicateurs.length).toBeGreaterThan(0);
    expect(informationsTicker.ratios.variationCAC).toBeDefined();
    expect(informationsTicker.ratios.correlationCAC).toBeDefined();
    expect(informationsTicker.ratios.qualiteFinanciere).toBeUndefined();
  });


  it('given le ticker BIOS when #chargerInformationsTicker then on récupère une erreur car aucune information', async () => {
    const promiseInformationsTicker: Promise<DTOInformationsTickerABCBourse> = lastValueFrom(service.chargerInformationsTicker('BIOS'));
    try {
      await promiseInformationsTicker;
    } catch (error: unknown) {
      expect(error).toBeDefined();
      expect((error as HttpErrorResponse).status).toBe(404);
    }
  });

  it('given AbcBourseService when #chargerActualites then on doit récupérer les actualités', async () => {
    const promiseActualites: Promise<DTOActualites> = firstValueFrom(service.chargerActualites());
    const actualites = await promiseActualites;
    expect(actualites.marches).toBeDefined();
    expect(actualites.analyses.length).toBeGreaterThan(0);
    expect(actualites.chroniques.length).toBeGreaterThan(0);
    expect(actualites.ventesADecouvert.length).toBeGreaterThan(0);
    expect(actualites.transactionsDirigeants.length).toBeGreaterThan(0);
  });
});
