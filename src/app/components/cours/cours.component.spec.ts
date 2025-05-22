import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoursComponent} from './cours.component';
import {CoursService} from '../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {VALEUR} from '../../services/jdd/JDDValeur';
import {LISTE_COURS} from '../../services/jdd/JDDCours';

describe('CoursComponent', () => {
  let component: CoursComponent;
  let fixture: ComponentFixture<CoursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCours']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CoursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(CoursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <h1>', () => {
    const element: HTMLElement = fixture.nativeElement;
    const el = element.querySelector('h1');
    expect(el).toBeTruthy();
  });

  describe('Given #chargerValeurs et #chargerCours renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of([VALEUR]));
      mockCoursService.chargerCours.and.returnValue(of(LISTE_COURS));
    });

    it('when #ngOnInit then component is loaded', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
