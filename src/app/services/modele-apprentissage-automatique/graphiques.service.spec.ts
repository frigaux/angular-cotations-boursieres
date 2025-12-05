import {TestBed} from '@angular/core/testing';

import {GraphiquesService} from './graphiques.service';

describe('GraphiquesService', () => {
  let service: GraphiquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphiquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
