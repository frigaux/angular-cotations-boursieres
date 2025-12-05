import {TestBed} from '@angular/core/testing';

import {ModelesService} from './modeles.service';

describe('ModelesService', () => {
  let service: ModelesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
