import {TestBed} from '@angular/core/testing';

import {ZoneBourseService} from './zone-bourse.service';
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {DTOActualitesZoneBourse} from './dto-actualites-zone-bourse.interface';

describe('ZoneBourseService', () => {
  let service: ZoneBourseService;
  const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({url: 'http://fabienrigaux.freeboxos.fr' + req.url}));
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ZoneBourseService,
        provideHttpClient(
          withInterceptors([httpRequestInterceptor])
        )
      ]
    });
    service = TestBed.inject(ZoneBourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('given ZoneBourseService when #chargerActualites then on doit récupérer les actualités', async () => {
    const promiseActualites: Promise<Array<DTOActualitesZoneBourse>> = firstValueFrom(service.chargerActualites(1));
    const actualites = await promiseActualites;
    expect(actualites.length).toBeGreaterThan(0);
    actualites.forEach(actualite => {
      expect(actualite.date).toBeDefined();
      expect(actualite.ticker).toBeDefined();
      expect(actualite.titre).toBeDefined();
      expect(actualite.pathname).toBeDefined();
    });
  });
});
