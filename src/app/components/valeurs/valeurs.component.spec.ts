import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValeursComponent} from './valeurs.component';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../services/cours/cours.service';
import {provideAnimations} from '@angular/platform-browser/animations';
import {VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {Valeur} from './valeur.class';

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

  // it('should have <p-tabs>', () => {
  //   const element: HTMLElement = fixture.nativeElement;
  //   const el = element.querySelector('p-tabs');
  //   expect(el).toBeTruthy();
  // });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    const valeur: Valeur = new Valeur(VALEURS[0], '');

    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      component.basculerAffichageValeur(valeur);
      expect(component.valeurSelectionnee).toEqual(valeur);
      const element: HTMLElement = fixture.nativeElement;
      const el = element.querySelector('p-tabs');
      expect(el).toBeDefined();
    });
  });
});
