import { TestBed } from '@angular/core/testing';

import { BoursoramaService } from './boursorama.service';

describe('BoursoramaService', () => {
  let service: BoursoramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoursoramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
