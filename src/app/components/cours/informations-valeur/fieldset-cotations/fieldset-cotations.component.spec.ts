import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FieldsetCotationsComponent} from './fieldset-cotations.component';

describe('FieldsetCotationsComponent', () => {
  let component: FieldsetCotationsComponent;
  let fixture: ComponentFixture<FieldsetCotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldsetCotationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldsetCotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
