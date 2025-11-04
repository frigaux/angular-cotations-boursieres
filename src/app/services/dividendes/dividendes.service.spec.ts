import {TestBed} from '@angular/core/testing';

import {DividendesService} from './dividendes.service';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../cours/cours.service';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('DividendesService', () => {
  let service: DividendesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: []
    });
    service = TestBed.inject(DividendesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
