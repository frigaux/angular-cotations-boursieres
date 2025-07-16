import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GestionTableauxComponent} from './gestion-tableaux.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';

describe('GestionTableauxComponent', () => {
  let component: GestionTableauxComponent;
  let fixture: ComponentFixture<GestionTableauxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionTableauxComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GestionTableauxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
