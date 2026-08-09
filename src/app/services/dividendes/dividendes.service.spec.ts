import {TestBed} from '@angular/core/testing';

import {DividendesService} from './dividendes.service';
import {TranslateModule} from '@ngx-translate/core';

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
