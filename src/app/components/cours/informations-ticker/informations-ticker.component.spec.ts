import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsTickerComponent } from './informations-ticker.component';

describe('InformationsTickerComponent', () => {
  let component: InformationsTickerComponent;
  let fixture: ComponentFixture<InformationsTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationsTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationsTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
