import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
  EntrainementModeleClassificationSuperviseeComponent
} from './entrainement-modele-classification-supervisee.component';

describe('EntrainementModeleClassificationSupervisee', () => {
  let component: EntrainementModeleClassificationSuperviseeComponent;
  let fixture: ComponentFixture<EntrainementModeleClassificationSuperviseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrainementModeleClassificationSuperviseeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntrainementModeleClassificationSuperviseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
