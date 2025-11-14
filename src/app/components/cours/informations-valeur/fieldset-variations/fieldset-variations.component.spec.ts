import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsetVariationsComponent } from './fieldset-variations.component';

describe('FieldsetVariationsComponent', () => {
  let component: FieldsetVariationsComponent;
  let fixture: ComponentFixture<FieldsetVariationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetVariationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetVariationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
