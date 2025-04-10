import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthentificationComponent } from './authentification.component';

describe('AuthentificationComponent', () => {
  let component: AuthentificationComponent;
  let fixture: ComponentFixture<AuthentificationComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AuthentificationComponent]
    });

    fixture = TestBed.createComponent(AuthentificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <div>', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const el = bannerElement.querySelector('div');
    expect(el).toBeTruthy();
  });
});
