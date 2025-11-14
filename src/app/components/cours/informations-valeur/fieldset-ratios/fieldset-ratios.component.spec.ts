import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsetRatiosComponent } from './fieldset-ratios.component';

describe('FieldsetRatiosComponent', () => {
  let component: FieldsetRatiosComponent;
  let fixture: ComponentFixture<FieldsetRatiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetRatiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetRatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
