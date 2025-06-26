import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../services/jdd/jdd-portefeuille.dataset';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));

  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        TranslateModule.forRoot({})
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <p-menubar>', () => {
    mockPortefeuillesService.charger.and.returnValue(clonePORTEFEUILLES());
    const element: HTMLElement = fixture.nativeElement;
    const el = element.querySelector('p-menubar');
    expect(el).toBeTruthy();
  });
});
