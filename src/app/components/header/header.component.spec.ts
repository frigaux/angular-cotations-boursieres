import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../services/jdd/jdd-portefeuille.dataset';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));

  let service: PortefeuillesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot({})
      ],
      providers: [PortefeuillesService]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PortefeuillesService);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <p-menubar>', () => {
    service.enregistrer(clonePORTEFEUILLES());
    const element: HTMLElement = fixture.nativeElement;
    const el = element.querySelector('p-menubar');
    expect(el).toBeTruthy();
  });
});
