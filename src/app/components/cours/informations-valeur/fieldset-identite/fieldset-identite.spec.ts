import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldsetIdentite} from './fieldset-identite';

describe('FieldsetIdentite', () => {
  let component: FieldsetIdentite;
  let fixture: ComponentFixture<FieldsetIdentite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetIdentite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetIdentite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
