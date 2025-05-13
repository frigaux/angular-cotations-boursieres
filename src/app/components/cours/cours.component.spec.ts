import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoursComponent} from './cours.component';
import {CoursService} from '../../services/cours/cours.service';
import {DTOValeur} from '../../services/valeurs/DTOValeur';
import {Marche} from '../../services/valeurs/marche';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {DTOListeCours} from '../../services/cours/DTOListeCours';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('CoursComponent', () => {
  let component: CoursComponent;
  let fixture: ComponentFixture<CoursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCours']);

  const valeurs: DTOValeur[] = [
    {
      "ticker": "GLE",
      "marche": Marche.EURO_LIST_A,
      "libelle": "Societe Generale"
    }
  ];

  const cours: DTOListeCours = {
    "date": new Date("2025-05-06"),
    "cours": [
      {
        "ticker": "GLE",
        "ouverture": 46.68,
        "plusHaut": 46.82,
        "plusBas": 45.16,
        "cloture": 45.34,
        "volume": 3074453,
        "moyennesMobiles": [
          45.34,
          45.895,
        ],
        "alerte": false
      }
    ]
  };

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

  it('should have <div>', () => {
    const element: HTMLElement = fixture.nativeElement;
    const el = element.querySelector('h1');
    expect(el).toBeTruthy();
  });

  describe('Given #chargerValeurs et #chargerCours renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(valeurs));
      mockCoursService.chargerCours.and.returnValue(of(cours));
    });

    it('when #ngOnInit then component is loaded', () => {
      component.ngOnInit();
      fixture.detectChanges(); // pour essayer de s'assurer que le error sur l'observable a bien été traité
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
