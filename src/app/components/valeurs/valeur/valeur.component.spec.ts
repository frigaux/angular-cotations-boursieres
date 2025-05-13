import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeurComponent} from './valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {of} from 'rxjs';
import {DTOCoursTicker} from '../../../services/cours/DTOCoursTicker';
import {DTOCoursTickerLight} from '../../../services/cours/DTOCoursTickerLight';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Marche} from '../../../services/valeurs/marche';

describe('ValeurComponent', () => {
  let component: ValeurComponent;
  let fixture: ComponentFixture<ValeurComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTicker', 'chargerCoursTickerWithLimit']);

  const coursTicker: DTOCoursTicker = {
    "date": new Date("2025-05-09"),
    "ouverture": 46.23,
    "plusHaut": 46.82,
    "plusBas": 46.06,
    "cloture": 46.8,
    "volume": 2141570,
    "moyennesMobiles": [
      46.8,
      46.68
    ],
    "alerte": true
  };

  const coursTickerLights: DTOCoursTickerLight[] = [
    {
      "date": new Date("2025-05-09"),
      "cloture": 46.23,
      "volume": 2141570,
      "alerte": true
    },
    {
      "date": new Date("2025-05-08"),
      "cloture": 45.7,
      "volume": 2047911,
      "alerte": true
    }
  ];

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
      mockCoursService.chargerCoursTicker.and.returnValue(of(coursTicker));
      mockCoursService.chargerCoursTickerWithLimit.and.returnValue(of(coursTickerLights));
    });

    it('when l\'input ticker est définie then le composant <p-panel> est rendu', () => {
      const element: HTMLElement = fixture.nativeElement;
      fixture.componentRef.setInput('valeur', {
        "ticker": "GLE",
        "marche": Marche.EURO_LIST_A,
        "libelle": "Societe Generale"
      });
      fixture.detectChanges();
      const el = element.querySelector('p-panel');
      expect(el).toBeTruthy();
    });
  });
});
