import { TestBed } from '@angular/core/testing';

import { PortefeuillesService } from './portefeuilles.service';

describe('PortefeuillesService', () => {
  let service: PortefeuillesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortefeuillesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
