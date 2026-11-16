import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoursicotageComponent} from './boursicotage.component';
import {TranslateModule} from '@ngx-translate/core';

describe('BoursicotageComponent', () => {
  let component: BoursicotageComponent;
  let fixture: ComponentFixture<BoursicotageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoursicotageComponent,
        TranslateModule.forRoot({})]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BoursicotageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
