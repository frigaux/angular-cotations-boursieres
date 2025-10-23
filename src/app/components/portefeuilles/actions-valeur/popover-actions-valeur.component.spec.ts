import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PopoverActionsValeurComponent} from './popover-actions-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {Cours} from '../../cours/cours.class';
import {COURS_PORTEFEUILLE} from '../../../services/jdd/jdd-cours.dataset';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuilles.dataset';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';

describe('ActionsValeurComponent', () => {
  let dialogueService: DialogueService;
  let component: PopoverActionsValeurComponent;
  let fixture: ComponentFixture<PopoverActionsValeurComponent>;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));
  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'enregistrer']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PopoverActionsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        ConfirmationService
      ]
    })
      .compileComponents();

    dialogueService = TestBed.inject(DialogueService);
    fixture = TestBed.createComponent(PopoverActionsValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given un cours et son portefeuille', () => {
    let portefeuilles: Array<DTOPortefeuille>;
    let cours: Cours = Cours.fromCoursPortefeuille(COURS_PORTEFEUILLE);

    beforeEach(() => {
      portefeuilles = clonePORTEFEUILLES();
      mockPortefeuillesService.charger.and.returnValue(portefeuilles);
    });

    it('when #afficher et #supprimerDuPortefeuille then la valeur est supprimée du portefeuille', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), cours, portefeuilles[0]);

      spyOn(dialogueService, 'confirmationSuppression').and.callThrough();
      spyOn(component, 'supprimerDuPortefeuille').and.callThrough();
      component.suppressionDuPortefeuille(new MouseEvent('click'));
      expect(dialogueService.confirmationSuppression).toHaveBeenCalled();
      const onSuppression: Function = (dialogueService.confirmationSuppression as jasmine.Spy).calls.mostRecent().args[3];
      onSuppression();
      expect(component.supprimerDuPortefeuille).toHaveBeenCalled();

      const expected = clonePORTEFEUILLES();
      expected[0].tickers.splice(expected[0].tickers.indexOf(cours.ticker), 1);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });

    it('when #afficher et #ajouterAuPortefeuille then la valeur est ajoutée au portefeuille', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), cours, portefeuilles[0]);

      component.ajouterAuPortefeuille();

      const expected = clonePORTEFEUILLES();
      expected[1].tickers.push(cours.ticker);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });

    it('when #afficher et #deplacerDansPortefeuille then la valeur est déplacée dans le portefeuille de destination', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), cours, portefeuilles[0]);

      component.deplacerDansPortefeuille();

      const expected = clonePORTEFEUILLES();
      expected[0].tickers.splice(expected[0].tickers.indexOf(cours.ticker), 1);
      expected[1].tickers.push(cours.ticker);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });
  });
});
