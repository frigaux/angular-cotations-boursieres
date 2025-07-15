import { TestBed } from '@angular/core/testing';

import { TableauxService } from './tableaux.service';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';

describe('TableauxService', () => {
  let service: TableauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe
      ]
    });
    service = TestBed.inject(TableauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
