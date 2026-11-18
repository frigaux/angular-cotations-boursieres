import {TestBed} from '@angular/core/testing';

import {BourseDirectService} from './bourse-direct.service';
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../boursorama/boursorama.service';
import {VALEUR} from '../jdd/jdd-valeurs.dataset';
import {firstValueFrom} from 'rxjs';
import {DTOCotations} from '../yahoo/dto-cotations.interface';

describe('BourseDirectService', () => {
  let service: BourseDirectService;
  const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({url: 'http://fabienrigaux.freeboxos.fr' + req.url}));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        BoursoramaService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])
        )
      ]
    });
    service = TestBed.inject(BourseDirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('given un ticker when #chargerCotationsTicker then on doit récupérer les cotations pour le ticker', async () => {
    const promiseDTOCotations: Promise<DTOCotations> = firstValueFrom(service.chargerCotationsTicker(VALEUR.ticker));
    const dto = await promiseDTOCotations;
    expect(dto.ticker).toBe(VALEUR.ticker);
  });
});
