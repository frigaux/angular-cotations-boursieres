import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendesComponent } from './dividendes.component';

describe('Dividendes', () => {
  let component: DividendesComponent;
  let fixture: ComponentFixture<DividendesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividendesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividendesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
