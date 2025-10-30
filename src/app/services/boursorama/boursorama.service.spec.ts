import {TestBed} from '@angular/core/testing';

import {BoursoramaService} from './boursorama.service';
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {VALEURS} from '../jdd/jdd-valeurs.dataset';
import {DTOCours} from '../cours/dto-cours.interface';
import {COURS_PORTEFEUILLE} from '../jdd/jdd-cours.dataset';
import {DTOCotationsTickerBoursorama} from './dto-cotations-ticker-boursorama.interface';

describe('BoursoramaService', () => {
  let service: BoursoramaService;
  const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({url: 'http://fabienrigaux.freeboxos.fr' + req.url}));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BoursoramaService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])
        )
      ]
    });
    service = TestBed.inject(BoursoramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('given des tickers when #chargerCoursTickers then on doit récupérer les cours pour les tickers', async () => {
    const tickers = VALEURS.map(valeur => valeur.ticker);
    const promiseDTOsCours: Promise<Array<DTOCours>> = firstValueFrom(service.chargerCoursTickers(tickers));
    const dtos = await promiseDTOsCours;
    expect(dtos).toHaveSize(tickers.length);
    dtos.forEach((dto, i) => {
      expect(dto.ticker).toBe(tickers[i]);
    });
  });

  it('given un ticker when #chargerCotationsTicker then on doit récupérer la cotation pour le ticker', async () => {
    const promiseCotationsTicker: Promise<DTOCotationsTickerBoursorama> = firstValueFrom(service.chargerCotationsTicker(COURS_PORTEFEUILLE));
    const dto = await promiseCotationsTicker;
    expect(dto.coursPortefeuille).toEqual(COURS_PORTEFEUILLE);
    expect(dto.achats.length).toBeGreaterThan(0);
    expect(dto.ventes.length).toBeGreaterThan(0);
    expect(dto.actualites.length).toBeGreaterThan(0);
    expect(dto.analyses.length).toBeGreaterThan(0);
  });
});
