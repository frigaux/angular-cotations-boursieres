import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeursComponent} from './valeurs.component';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../services/cours/cours.service';
import {provideAnimations} from '@angular/platform-browser/animations';
import {VALEURS} from '../../services/jdd/JDDValeur';

describe('ValeursComponent', () => {
  let component: ValeursComponent;
  let fixture: ComponentFixture<ValeursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTicker', 'chargerCoursTickerWithLimit']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(ValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <p-accordion>', () => {
    const element: HTMLElement = fixture.nativeElement;
    const el = element.querySelector('p-accordion');
    expect(el).toBeTruthy();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
    });

    it('when #ngOnInit then component is loaded', () => {
      component.ngOnInit();
      fixture.detectChanges(); // pour essayer de s'assurer que le error sur l'observable a bien été traité
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
