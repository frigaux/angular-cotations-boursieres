import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeursComponent} from './valeurs.component';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DTOValeur} from '../../services/valeurs/DTOValeur';
import {of} from 'rxjs';
import {Marche} from '../../services/valeurs/marche';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../services/cours/cours.service';

describe('ValeursComponent', () => {
  let component: ValeursComponent;
  let fixture: ComponentFixture<ValeursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTicker', 'chargerCoursTickerWithLimit']);

  const valeurs: DTOValeur[] = [
    {
      "ticker": "GLE",
      "marche": Marche.EURO_LIST_A,
      "libelle": "Societe Generale"
    },
    {
      "ticker": "BNP",
      "marche": Marche.EURO_LIST_A,
      "libelle": "Bnp Paribas"
    }
  ];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        ValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService}
      ]
    });

    fixture = TestBed.createComponent(ValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have <div>', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const el = bannerElement.querySelector('div');
    expect(el).toBeTruthy();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(valeurs));
    });

    it('when #ngOnInit then component is loaded', () => {
      component.ngOnInit();
      fixture.detectChanges(); // pour essayer de s'assurer que le error sur l'observable a bien été traité
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
