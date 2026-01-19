import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldsetAnalysesComponent} from './fieldset-analyses.component';

describe('FieldsetAnalysesComponent', () => {
  let component: FieldsetAnalysesComponent;
  let fixture: ComponentFixture<FieldsetAnalysesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetAnalysesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetAnalysesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
