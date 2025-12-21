import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RegressionSuperviseeComponent} from './regression-supervisee.component';
import {TranslateModule} from '@ngx-translate/core';

describe('RegressionSuperviseeComponent', () => {
  let component: RegressionSuperviseeComponent;
  let fixture: ComponentFixture<RegressionSuperviseeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegressionSuperviseeComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegressionSuperviseeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
