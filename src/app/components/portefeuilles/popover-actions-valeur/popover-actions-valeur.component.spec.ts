import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PopoverActionsValeurComponent} from './popover-actions-valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {DTOPortefeuille} from '../../../services/portefeuilles/dto-portefeuille.interface';
import {COURS_PORTEFEUILLE} from '../../../services/jdd/jdd-cours.dataset';
import {PORTEFEUILLES} from '../../../services/jdd/jdd-portefeuilles.dataset';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {PortefeuilleAvecCours} from '../portefeuille-avec-cours.class';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';

describe('PopoverActionsValeurComponent', () => {
  let dialogueService: DialogueService;
  let component: PopoverActionsValeurComponent;
  let fixture: ComponentFixture<PopoverActionsValeurComponent>;

  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));
  const mockPortefeuillesService = jasmine.createSpyObj('PortefeuillesService', ['charger', 'enregistrer']);
  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTicker']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerCotationsTicker', 'chargerCotationsTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PopoverActionsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: PortefeuillesService, useValue: mockPortefeuillesService},
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
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
    let portefeuille: PortefeuilleAvecCours;

    beforeEach(() => {
      const portefeuilles: Array<DTOPortefeuille> = clonePORTEFEUILLES();
      portefeuille = new PortefeuilleAvecCours(portefeuilles[0]);
      mockPortefeuillesService.charger.and.returnValue(portefeuilles);
    });

    it('when #afficher et #supprimerDuPortefeuille then la valeur est supprimée du portefeuille', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), COURS_PORTEFEUILLE, portefeuille);

      spyOn(dialogueService, 'confirmationSuppression').and.callThrough();
      spyOn(component, 'supprimerDuPortefeuille').and.callThrough();
      component.suppressionDuPortefeuille(new MouseEvent('click'));
      expect(dialogueService.confirmationSuppression).toHaveBeenCalled();
      const onSuppression: Function = (dialogueService.confirmationSuppression as jasmine.Spy).calls.mostRecent().args[3];
      onSuppression();
      expect(component.supprimerDuPortefeuille).toHaveBeenCalled();

      const expected = clonePORTEFEUILLES();
      expected[0].tickers.splice(expected[0].tickers.indexOf(COURS_PORTEFEUILLE.ticker), 1);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });

    it('when #afficher et #ajouterAuPortefeuille then la valeur est ajoutée au portefeuille', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), COURS_PORTEFEUILLE, portefeuille);

      component.ajouterAuPortefeuille();

      const expected = clonePORTEFEUILLES();
      expected[1].tickers.push(COURS_PORTEFEUILLE.ticker);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });

    it('when #afficher et #deplacerDansPortefeuille then la valeur est déplacée dans le portefeuille de destination', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.afficher(new MouseEvent('click'), COURS_PORTEFEUILLE, portefeuille);

      component.deplacerDansPortefeuille();

      const expected = clonePORTEFEUILLES();
      expected[0].tickers.splice(expected[0].tickers.indexOf(COURS_PORTEFEUILLE.ticker), 1);
      expected[1].tickers.push(COURS_PORTEFEUILLE.ticker);
      expect(mockPortefeuillesService.enregistrer).toHaveBeenCalledWith(expected);
    });
  });
});
