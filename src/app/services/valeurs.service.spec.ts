import { TestBed } from '@angular/core/testing';

import { ValeursService } from './valeurs.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ValeursService', () => {
  let service: ValeursService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValeursService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ValeursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
