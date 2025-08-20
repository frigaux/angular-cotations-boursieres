import { TestBed } from '@angular/core/testing';

import { AbcBourseService } from './abc-bourse.service';

describe('AbcBourseService', () => {
  let service: AbcBourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbcBourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
