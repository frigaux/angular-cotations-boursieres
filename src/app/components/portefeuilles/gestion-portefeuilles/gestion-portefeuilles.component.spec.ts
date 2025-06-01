import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GestionPortefeuillesComponent} from './gestion-portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuille.dataset';
import {Portefeuille} from './portefeuille.interface';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';

describe('GestionPortefeuillesComponent', () => {
  let component: GestionPortefeuillesComponent;
  let fixture: ComponentFixture<GestionPortefeuillesComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES))

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
        {provide: PortefeuillesService, useValue: mockPortefeuillesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GestionPortefeuillesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    it('when #creerPortefeuille then les un nouveau portefeuille est crée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.creerPortefeuille('nomUnique');
      const expected = clonePORTEFEUILLES().concat({'nom': 'nomUnique', tickers: []});
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #modifierPortefeuille then le portefeuille est modifié', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.modificationPortefeuille(0);
      component.modifierPortefeuille('nomUnique');
      const expected: Array<Portefeuille> = clonePORTEFEUILLES();
      expected[0].nom = 'nomUnique';
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #supprimerPortefeuille then le portefeuille est bien supprimé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.supprimerPortefeuille(0);
      const expected: Array<Portefeuille> = clonePORTEFEUILLES()
      expected.splice(0, 1);
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #editerPortefeuille then le portefeuille est bien modifié', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.editionPortefeuille(0);
      component.editerPortefeuille([]);
      const expected: Array<Portefeuille> = clonePORTEFEUILLES()
      expected[0].tickers = [];
      expect(component.portefeuilles).toEqual(expected);
    });
  });
});
