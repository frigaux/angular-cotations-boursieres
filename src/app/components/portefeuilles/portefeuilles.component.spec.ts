import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortefeuillesComponent} from './portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {of} from 'rxjs';
import {VALEUR} from '../../services/jdd/jdd-valeur.dataset';
import {LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../services/jdd/jdd-cours.dataset';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {PORTEFEUILLE} from '../../services/jdd/jdd-portefeuille.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('PortefeuillesComponent', () => {
  let component: PortefeuillesComponent;
  let fixture: ComponentFixture<PortefeuillesComponent>;

  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger']);
  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PortefeuillesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(PortefeuillesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerValeurs et #chargerCours renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue([PORTEFEUILLE]);
      mockValeursService.chargerValeurs.and.returnValue(of([VALEUR]));
      mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(LISTE_COURS_AVEC_LISTE_ALLEGEE));
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
