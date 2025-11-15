import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsetDividendesComponent } from './fieldset-dividendes.component';

describe('FieldsetDividendesComponent', () => {
  let component: FieldsetDividendesComponent;
  let fixture: ComponentFixture<FieldsetDividendesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetDividendesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetDividendesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
