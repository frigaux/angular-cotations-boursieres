import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsetIndicateursComponent } from './fieldset-indicateurs.component';

describe('FieldsetIndicateursComponent', () => {
  let component: FieldsetIndicateursComponent;
  let fixture: ComponentFixture<FieldsetIndicateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetIndicateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetIndicateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
