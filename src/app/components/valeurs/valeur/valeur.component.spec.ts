import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeurComponent} from './valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {
  COURS_TICKER,
  LISTE_COURS_TICKER_ALLEGE
} from '../../../services/jdd/jdd-cours.dataset';
import {VALEUR} from '../../../services/jdd/jdd-valeurs.dataset';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {DatePipe} from '@angular/common';

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
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        DatePipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerCoursTicker et #chargerCoursTickerWithLimit renvoient des cours', () => {
    beforeEach(() => {
      mockCoursService.chargerCoursTicker.and.returnValue(of(COURS_TICKER));
      mockCoursService.chargerCoursTickerWithLimit.and.returnValue(of(LISTE_COURS_TICKER_ALLEGE));
    });

    it('when l\'input ticker est définie then le composant <p-drawer> est rendu', () => {
      const element: HTMLElement = fixture.nativeElement;
      fixture.componentRef.setInput('valeur', VALEUR);
      fixture.detectChanges();
      // TODO : le p-drawer est affiché dans le rapport généré par karma :/
      const el = element.querySelector('p-drawer');
      expect(el).toBeTruthy();
    });
  });
});
