import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldsetPrevisionsComponent } from './fieldset-previsions.component';

describe('FieldsetPrevisionsComponent', () => {
  let component: FieldsetPrevisionsComponent;
  let fixture: ComponentFixture<FieldsetPrevisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetPrevisionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetPrevisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
