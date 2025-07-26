import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AjoutAuPortefeuilleComponent} from './ajout-au-portefeuille.component';
import {TranslateModule} from '@ngx-translate/core';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuilles.dataset';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';

describe('AjoutAuPortefeuilleComponent', () => {
  let component: AjoutAuPortefeuilleComponent;
  let fixture: ComponentFixture<AjoutAuPortefeuilleComponent>;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));
  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'enregistrer']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AjoutAuPortefeuilleComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: PortefeuillesService, useValue: mockPortefeuillesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AjoutAuPortefeuilleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des portefeuilles', () => {
    let portefeuilles: Array<DTOPortefeuille> = clonePORTEFEUILLES();

    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue(portefeuilles);
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component.portefeuilles).toEqual(portefeuilles);
    });

    it('when #afficher et #ajouterAuPortefeuille then la valeur est ajoutée au portefeuille par défaut', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), 'AIR');
      expect(component.ticker).toBe('AIR');
      component.ajouterAuPortefeuille();
      expect(portefeuilles.find(p => p.parDefaut)?.tickers).toContain('AIR');
    });
  });
});
