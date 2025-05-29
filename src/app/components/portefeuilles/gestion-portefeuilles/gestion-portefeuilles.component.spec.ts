import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GestionPortefeuillesComponent} from './gestion-portefeuilles.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuille.dataset';
import {Portefeuille} from './portefeuille.interface';
import {ValeursService} from '../../../services/valeurs/valeurs.service';

describe('GestionPortefeuillesComponent', () => {
  let component: GestionPortefeuillesComponent;
  let fixture: ComponentFixture<GestionPortefeuillesComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES))

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GestionPortefeuillesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GestionPortefeuillesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given un LocalStorage avec des portefeuilles', () => {
    beforeEach(() => {
      component.setLocalStorage(clonePORTEFEUILLES());
    });

    it('when #ngOnInit then les portefeuilles sont chargés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.portefeuilles).toEqual(PORTEFEUILLES);
    });

    it('when #creerPortefeuille sans nom then les portefeuilles ne sont pas modifiés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.creerPortefeuille();
      expect(component.portefeuilles).toEqual(PORTEFEUILLES);
    });

    it('when #creerPortefeuille avec un nom en doublon then les portefeuilles ne sont pas modifiés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.formulaireCreationPortefeuille.get('champNom')?.setValue(PORTEFEUILLES[0].nom);
      component.creerPortefeuille();
      expect(component.portefeuilles).toEqual(PORTEFEUILLES);
    });

    it('when #creerPortefeuille avec un nom unique then un nouveau portefeuille est crée', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.formulaireCreationPortefeuille.get('champNom')?.setValue('nomUnique');
      component.creerPortefeuille();
      const expected = PORTEFEUILLES.concat({'nom': 'nomUnique', tickers: []});
      expect(component.portefeuilles).toEqual(expected);
    });

    it('when #renommerPortefeuille avec un nom en doublon then les portefeuilles ne sont pas modifiés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.renommagePortefeuille(0);
      component.formulaireModificationPortefeuille.get('champNom')?.setValue(PORTEFEUILLES[1].nom);
      component.renommerPortefeuille();
      expect(component.portefeuilles).toEqual(PORTEFEUILLES);
    });

    it('when #renommerPortefeuille avec un nom unique then les portefeuilles sont modifiés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.renommagePortefeuille(0);
      component.formulaireModificationPortefeuille.get('champNom')?.setValue('nomUnique');
      component.renommerPortefeuille();
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
