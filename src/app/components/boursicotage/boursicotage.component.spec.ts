import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoursicotageComponent} from './boursicotage.component';
import {TranslateModule} from '@ngx-translate/core';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../services/jdd/jdd-cours.dataset';
import {PORTEFEUILLE} from '../../services/jdd/jdd-portefeuilles.dataset';
import {BourseDirectService} from '../../services/bourse-direct/bourse-direct.service';
import {DatePipe, PercentPipe} from '@angular/common';
import {COTATIONS_GLE} from '../../services/jdd/jdd-bourse-direct.dataset';

describe('BoursicotageComponent', () => {
  let component: BoursicotageComponent;
  let fixture: ComponentFixture<BoursicotageComponent>;

  const clonePORTEFEUILLE: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLE));

  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger']);
  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs', 'chargerAchats', 'onUpdateAchats']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);
  const mockBourseDirectService = jasmine.createSpyObj('BourseDirectService', ['chargerCotationsTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BoursicotageComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        {provide: BourseDirectService, useValue: mockBourseDirectService},
        DatePipe,
        PercentPipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BoursicotageComponent);
    component = fixture.componentInstance;
  });

  describe('Given #chargerValeurs et #chargerCoursTickersWithLimit renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue([clonePORTEFEUILLE()]);
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
      mockValeursService.chargerAchats.and.returnValue(ACHATS);
      mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(LISTE_COURS_AVEC_LISTE_ALLEGEE));
      mockBourseDirectService.chargerCotationsTicker.and.returnValue(of(COTATIONS_GLE));
    });

    it('when #ngOnInit then les cotations sont chargées', async () => {
      // déclenche ngOnInit
      fixture.detectChanges();
      // Attendre la stabilisation de la fixture pour s'assurer que tous les Observables
      // (et micro/macro-tâches) déclenchés par le cycle de détection ont terminé.
      // await fixture.whenStable();

      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      expect(component.cotationsOrdresAchats).toHaveSize(1);
      expect(component.cotationsAchats).toHaveSize(4);
      expect(component.cotationsOrdresVentes).toHaveSize(1);

    });
  });
});
