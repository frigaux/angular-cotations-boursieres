import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GestionPortefeuillesComponent} from './gestion-portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuille.dataset';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {ConfirmationService} from 'primeng/api';

describe('GestionPortefeuillesComponent', () => {
  let component: GestionPortefeuillesComponent;
  let fixture: ComponentFixture<GestionPortefeuillesComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'onImport', 'enregistrer']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionPortefeuillesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        {provide: ConfirmationService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GestionPortefeuillesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given un LocalStorage avec des portefeuilles existants', () => {
    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue(clonePORTEFEUILLES());
    });

    it('when #ngOnInit then les portefeuilles sont chargés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.portefeuilles).toEqual(PORTEFEUILLES);
    });

    it('when #creerPortefeuille then un nouveau portefeuille est crée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.creerPortefeuille('nomUnique');
      const expected = clonePORTEFEUILLES().concat({nom: 'nomUnique', parDefaut: false, tickers: [], alertes: []});
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #modifierNomPortefeuille then le portefeuille est modifié', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.modificationNomPortefeuille(0);
      component.modifierNomPortefeuille('nomUnique');
      const expected: Array<DTOPortefeuille> = clonePORTEFEUILLES();
      expected[0].nom = 'nomUnique';
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #modifierAlertesPortefeuille then les alertes du portefeuille sont bien modifiées', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.editionAlertesPortefeuille(1);
      component.modifierAlertesPortefeuille(clonePORTEFEUILLES()[0].alertes);
      const expected: Array<DTOPortefeuille> = clonePORTEFEUILLES();
      expected[1].alertes = expected[0].alertes;
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #supprimerPortefeuille then le portefeuille est bien supprimé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.supprimerPortefeuille(0);
      const expected: Array<DTOPortefeuille> = clonePORTEFEUILLES()
      expected.splice(0, 1);
      expected[0].parDefaut = true;
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #modifierValeursPortefeuille then le portefeuille est bien modifié', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.associationValeursPortefeuille(0);
      component.modifierValeursPortefeuille([]);
      const expected: Array<DTOPortefeuille> = clonePORTEFEUILLES()
      expected[0].tickers = [];
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #changerParDefaut then le portefeuille par défaut est bien modifié', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.changerParDefaut(1);
      const expected: Array<DTOPortefeuille> = clonePORTEFEUILLES()
      expected[0].parDefaut = false;
      expected[1].parDefaut = true;
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #monterPortefeuille puis #descendrePortefeuille then l\'ordre des portefeuilles est inchangé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.monterPortefeuille(1);
      component.descendrePortefeuille(0);
      expect(component.portefeuilles).toEqual(clonePORTEFEUILLES());
    });
  });
});
