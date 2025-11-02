import { TestBed } from '@angular/core/testing';

import { DividendesService } from './dividendes.service';

describe('DividendesService', () => {
  let service: DividendesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DividendesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
