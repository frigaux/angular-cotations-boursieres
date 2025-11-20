import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ColonneDividendesComponent} from './colonne-dividendes.component';

describe('Dividendes', () => {
  let component: ColonneDividendesComponent;
  let fixture: ComponentFixture<ColonneDividendesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColonneDividendesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColonneDividendesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
