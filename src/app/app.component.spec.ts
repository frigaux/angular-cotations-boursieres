import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppComponent} from './app.component';
import {TranslateModule} from '@ngx-translate/core';

describe('AppComponent', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot({})
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;
  });

  it('should create', () => {
    expect(appComponent).toBeDefined();
  });

  it('should have <app-header>', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const el = bannerElement.querySelector('app-header');
    expect(el).toBeTruthy();
  });
});
