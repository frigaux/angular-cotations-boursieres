import {TestBed} from '@angular/core/testing';

import {AbcBourseService} from './abc-bourse.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('AbcBourseService', () => {
  let service: AbcBourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AbcBourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
