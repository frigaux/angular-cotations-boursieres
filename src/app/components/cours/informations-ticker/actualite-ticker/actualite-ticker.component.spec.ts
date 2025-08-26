import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteTickerComponent } from './actualite-ticker.component';

describe('ActualiteComponent', () => {
  let component: ActualiteTickerComponent;
  let fixture: ComponentFixture<ActualiteTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
