import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthentificationComponent } from './authentification.component';
import { AuthentificationService } from '../../services/authentification.service';

describe('AuthentificationComponent', () => {
  let component: AuthentificationComponent;
  let fixture: ComponentFixture<AuthentificationComponent>;

  const mockAuthentificationService = jasmine.createSpyObj('AuthentificationService', ['authentifier']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AuthentificationComponent],
      providers: [
        { provide: AuthentificationService, useValue: mockAuthentificationService }
      ]
    });

    fixture = TestBed.createComponent(AuthentificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <div>', () => {// TODO : appeler ngOnInit ? avec mock AuthentificationService ?
    const bannerElement: HTMLElement = fixture.nativeElement;
    const el = bannerElement.querySelector('div');
    expect(el).toBeTruthy();
  });
});
