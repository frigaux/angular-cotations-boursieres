import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortefeuillesComponent} from './portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../services/jdd/jdd-cours.dataset';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {PORTEFEUILLE} from '../../services/jdd/jdd-portefeuilles.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ConfirmationService} from 'primeng/api';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {AbcBourseService} from '../../services/abc-bourse/abc-bourse.service';

describe('PortefeuillesComponent', () => {
  let component: PortefeuillesComponent;
  let fixture: ComponentFixture<PortefeuillesComponent>;

  const clonePORTEFEUILLE: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLE));

  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'onUpdate', 'indexPortefeuilleParDefaut']);
  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs', 'chargerAchatsByTicker', 'chargerAchatsTicker', 'onImportAchats', 'onUpdateAchats', 'chargerAchats']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerActualites']);

  const achatsByTicker = new Map<string, Array<DTOAchat>>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PortefeuillesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        // {provide: PortefeuillesService, useValue: {charger: function() {return [PORTEFEUILLE];}}},
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        ConfirmationService,
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe,
        provideAnimations()
      ]
    });

    fixture = TestBed.createComponent(PortefeuillesComponent);
    component = fixture.componentInstance;

    // construction JDD
    const ticker = LISTE_COURS_AVEC_LISTE_ALLEGEE[0].ticker;
    const achats = ACHATS
      .filter(achat => achat.ticker === ticker)
      .map(achat => achat.achats)
      .flat();
    achatsByTicker.set(ticker, achats);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerValeurs et #chargerCours renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue([clonePORTEFEUILLE()]);
      mockPortefeuillesService.indexPortefeuilleParDefaut.and.returnValue(0);
      mockValeursService.chargerValeurs.and.returnValue(of([VALEURS[0]]));
      mockValeursService.chargerAchatsByTicker.and.returnValue(achatsByTicker);
      mockValeursService.chargerAchatsTicker.and.returnValue(ACHATS[0].achats);
      mockValeursService.chargerAchats.and.returnValue([ACHATS[0]]);
      mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(LISTE_COURS_AVEC_LISTE_ALLEGEE));
    });

    it('when #ngOnInit then le portefeuille est chargé avec adjonction du portefeuille "achats"', async () => {
      // déclenche ngOnInit
      fixture.detectChanges();
      // Attendre la stabilisation de la fixture pour s'assurer que tous les Observables
      // (et micro/macro-tâches) déclenchés par le cycle de détection ont terminé.
      // await fixture.whenStable();

      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      component.basculerAffichageCours(component.portefeuillesAvecCours[0].cours[0]);
      expect(component.coursSelectionne).toBeDefined();
      expect(component.portefeuillesAvecCours).toHaveSize(2);
    });
  });
});
