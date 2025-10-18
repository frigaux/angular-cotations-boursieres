import {TestBed} from '@angular/core/testing';

import {BoursoramaService} from './boursorama.service';
import {HttpInterceptorFn, provideHttpClient, withInterceptors} from '@angular/common/http';

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

  // Tester WS boursorama opérationnel
});
