import {TestBed} from '@angular/core/testing';

import {YahooService} from './yahoo.service';
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';
import {VALEUR, VALEURS} from '../jdd/jdd-valeurs.dataset';
import {firstValueFrom} from 'rxjs';
import {DTOCotations} from './dto-cotations.interface';

describe('YahooService', () => {
  let service: YahooService;
  const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({url: 'http://fabienrigaux.freeboxos.fr' + req.url}));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        YahooService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])
        )
      ]
    });
    service = TestBed.inject(YahooService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('given un ticker when #chargerCotationsTicker then on doit récupérer les cotations pour le ticker', async () => {
    const promiseDTOCotations: Promise<DTOCotations> = firstValueFrom(service.chargerCotationsTicker(VALEUR.ticker));
    const dto = await promiseDTOCotations;
    expect(dto.ticker).toBe(VALEUR.ticker);
  });

  it('given des tickers when #chargerCotationsTickers then on doit récupérer les cotations pour les tickers', async () => {
    const tickers = VALEURS.map(valeur => valeur.ticker);
    const promiseDTOsCotations: Promise<DTOCotations[]> = firstValueFrom(service.chargerCotationsTickers(tickers));
    const dtos = await promiseDTOsCotations;
    expect(dtos).toHaveSize(tickers.length);
    dtos.forEach((dto, i) => {
      expect(dto.ticker).toBe(tickers[i]);
    });
  });
});
