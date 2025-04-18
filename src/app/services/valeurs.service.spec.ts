import { TestBed } from '@angular/core/testing';

import { ValeursService } from './valeurs.service';

describe('ValeursService', () => {
  let service: ValeursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValeursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
