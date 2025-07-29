import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsValeursComponent} from './achats-valeurs.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';

describe('AchatsValeursComponent', () => {
  let component: AchatsValeursComponent;
  let fixture: ComponentFixture<AchatsValeursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AchatsValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AchatsValeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
