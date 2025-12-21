import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EntrainementModeleRegressionSuperviseeComponent} from './entrainement-modele-regression-supervisee.component';
import {TranslateModule} from '@ngx-translate/core';

describe('EntrainementModeleRegressionSuperviseeComponent', () => {
  let component: EntrainementModeleRegressionSuperviseeComponent;
  let fixture: ComponentFixture<EntrainementModeleRegressionSuperviseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EntrainementModeleRegressionSuperviseeComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntrainementModeleRegressionSuperviseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
