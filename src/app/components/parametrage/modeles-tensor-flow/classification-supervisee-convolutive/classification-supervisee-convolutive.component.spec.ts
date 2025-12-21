import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ClassificationSuperviseeConvolutiveComponent} from './classification-supervisee-convolutive.component';
import {TranslateModule} from '@ngx-translate/core';

describe('ClassificationSuperviseeConvolutiveComponent', () => {
  let component: ClassificationSuperviseeConvolutiveComponent;
  let fixture: ComponentFixture<ClassificationSuperviseeConvolutiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClassificationSuperviseeConvolutiveComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClassificationSuperviseeConvolutiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
