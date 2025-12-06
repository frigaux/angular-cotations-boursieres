import {TestBed} from '@angular/core/testing';

import {GraphiquesService} from './graphiques.service';
import {TranslateModule} from '@ngx-translate/core';

describe('GraphiquesService', () => {
  let service: GraphiquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ]
    });
    service = TestBed.inject(GraphiquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
