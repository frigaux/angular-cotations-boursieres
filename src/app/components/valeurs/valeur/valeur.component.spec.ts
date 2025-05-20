import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeurComponent} from './valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {COURS_TICKER, LISTE_COURS_TICKER_LIGHT} from '../../../services/jdd/JDDCours';
import {VALEUR} from '../../../services/jdd/JDDValeur';

describe('ValeurComponent', () => {
  let component: ValeurComponent;
  let fixture: ComponentFixture<ValeurComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTicker', 'chargerCoursTickerWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService},
        provideAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerCoursTicker et #chargerCoursTickerWithLimit renvoient des cours', () => {
    beforeEach(() => {
      mockCoursService.chargerCoursTicker.and.returnValue(of(COURS_TICKER));
      mockCoursService.chargerCoursTickerWithLimit.and.returnValue(of(LISTE_COURS_TICKER_LIGHT));
    });

    it('when l\'input ticker est définie then le composant <p-panel> est rendu', () => {
      const element: HTMLElement = fixture.nativeElement;
      fixture.componentRef.setInput('valeur', VALEUR);
      fixture.detectChanges();
      const el = element.querySelector('p-panel');
      expect(el).toBeTruthy();
    });
  });
});
