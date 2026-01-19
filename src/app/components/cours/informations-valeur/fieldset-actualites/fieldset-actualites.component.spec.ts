import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldsetActualitesComponent} from './fieldset-actualites.component';

describe('FieldsetActualitesComponent', () => {
  let component: FieldsetActualitesComponent;
  let fixture: ComponentFixture<FieldsetActualitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetActualitesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
