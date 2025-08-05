import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PortefeuillesComponent} from './portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {CoursService} from '../../services/cours/cours.service';
import {of} from 'rxjs';
import {ACHATS, VALEUR} from '../../services/jdd/jdd-valeurs.dataset';
import {COURS_PORTEFEUILLE, LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../services/jdd/jdd-cours.dataset';
import {PortefeuillesService} from '../../services/portefeuilles/portefeuilles.service';
import {PORTEFEUILLE} from '../../services/jdd/jdd-portefeuilles.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';
import {ConfirmationService} from 'primeng/api';
import {DTOAchat} from '../../services/valeurs/dto-achat.interface';

describe('PortefeuillesComponent', () => {
  let component: PortefeuillesComponent;
  let fixture: ComponentFixture<PortefeuillesComponent>;

  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'onUpdate']);
  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs', 'chargerAchatsByTicker', 'onImportAchats', 'onUpdateAchats']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

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
        ConfirmationService,
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

  it('Given aucun achat when #calculerVariationAchats then la fonction renvoie undefined', () => {
    expect(component.calculerVariationAchats(LISTE_COURS_AVEC_LISTE_ALLEGEE[0], new Map<string, Array<DTOAchat>>())).toBeUndefined();
  });

  it('Given deux achats when #calculerVariationAchats then la fonction renvoie la moyenne du prix d\'achat', () => {
    expect(component.calculerVariationAchats(LISTE_COURS_AVEC_LISTE_ALLEGEE[0], achatsByTicker)).toEqual(0.02012642592458036);
  });

  describe('Given #chargerValeurs et #chargerCours renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue([PORTEFEUILLE]);
      mockValeursService.chargerValeurs.and.returnValue(of([VALEUR]));
      mockValeursService.chargerAchatsByTicker.and.returnValue(achatsByTicker);
      mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(LISTE_COURS_AVEC_LISTE_ALLEGEE));
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      component.basculerAffichageCours(component.portefeuillesAvecCours[0].cours[0]);
      expect(component.coursSelectionne).toBeDefined();
    });
  });
});
