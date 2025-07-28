import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionsValeurComponent} from './actions-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {Cours} from '../../cours/cours.class';
import {COURS_PORTEFEUILLE} from '../../../services/jdd/jdd-cours.dataset';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuilles.dataset';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';

describe('AchatValeurComponent', () => {
  let component: ActionsValeurComponent;
  let fixture: ComponentFixture<ActionsValeurComponent>;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));
  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'enregistrer']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActionsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: PortefeuillesService, useValue: mockPortefeuillesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActionsValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given un cours et son portefeuille', () => {
    let portefeuilles: Array<DTOPortefeuille> = clonePORTEFEUILLES();
    let cours: Cours = Cours.fromCoursPortefeuille(COURS_PORTEFEUILLE);

    beforeEach(() => {
      mockPortefeuillesService.charger.and.returnValue(portefeuilles);
    });

    it('when #afficher et #supprimerDuPortefeuille then la valeur est supprimée du portefeuille', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), cours, portefeuilles[0]);
      component.supprimerDuPortefeuille();
      const expected = clonePORTEFEUILLES();
      expected[0].tickers.splice(expected[0].tickers.indexOf(cours.ticker), 1);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });
  });
});
