import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsValeurComponent} from './details-valeur.component';
import {COURS_CROISSANT, LISTE_COURS_TICKER_ALLEGE} from '../../../services/jdd/jdd-cours.dataset';
import {TranslateModule} from '@ngx-translate/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {CoursService} from '../../../services/cours/cours.service';
import {VALEUR} from '../../../services/jdd/jdd-valeurs.dataset';
import {of} from 'rxjs';

describe('DetailsValeurComponent', () => {
  let component: DetailsValeurComponent;
  let fixture: ComponentFixture<DetailsValeurComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerInformationsTicker']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickerWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DetailsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        {provide: CoursService, useValue: mockCoursService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerCoursTickerWithLimit renvoie les cours d\'un ticker', () => {
    beforeEach(() => {
      mockCoursService.chargerCoursTickerWithLimit.and.returnValue(of(LISTE_COURS_TICKER_ALLEGE));
    });

    it('Given un cours when le composant est rendu then le <p-panel> et <p-chart> sont rendus', () => {
      const element: HTMLElement = fixture.nativeElement;
      fixture.componentRef.setInput('cours', {cours: COURS_CROISSANT, valeur: VALEUR, premier: true, dernier: true});
      fixture.detectChanges();
      const elPanel = element.querySelector('p-panel');
      expect(elPanel).toBeTruthy();
      const elChart = element.querySelector('p-chart');
      expect(elChart).toBeTruthy();
    });
  });
});
