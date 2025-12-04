import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsValeursComponent} from './achats-valeurs.component';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {DialogueService} from '../../services/dialogue/dialogue.service';
import {CoursService} from '../../services/cours/cours.service';
import {COURS_BNP, COURS_GLE, LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../services/jdd/jdd-cours.dataset';
import {BoursoramaService} from '../../services/boursorama/boursorama.service';
import {DialogCoursAchatsComponent} from './dialog-cours-achats/dialog-cours-achats.component';

describe('AchatsValeursComponent', () => {
  let dialogueService: DialogueService;
  let component: AchatsValeursComponent;
  let fixture: ComponentFixture<AchatsValeursComponent>;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS));

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['onUpdateAchats', 'onImportAchats', 'chargerValeurs', 'chargerAchats', 'enregistrerAchatsTicker', 'chargerAchatsTicker']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);
  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AchatsValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        ConfirmationService
      ]
    })
      .compileComponents();

    dialogueService = TestBed.inject(DialogueService);
    fixture = TestBed.createComponent(AchatsValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    let nbAchats: number = ACHATS
      .reduce((accumulator, ticker) => accumulator + ticker.achats.length, 0);

    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
      mockValeursService.chargerAchats.and.returnValue(cloneACHATS());
      mockValeursService.chargerAchatsTicker.and.returnValue(cloneACHATS()[1].achats);
      mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(LISTE_COURS_AVEC_LISTE_ALLEGEE));
      mockBoursoramaService.chargerCoursTickers.and.returnValue(of([COURS_GLE, COURS_BNP]));
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      expect(component.achats).toHaveSize(nbAchats);
      expect(component.achats![0].valeur).toEqual(VALEURS[1]);
      expect(component.achats![1].valeur).toEqual(VALEURS[0]);
    });


    it('when #ngOnInit et #suppressionAchat then l\'achat est bien supprimé', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      spyOn(dialogueService, 'confirmationSuppression').and.callThrough();
      const achatsNonRevendus = component.achats;
      const achat = achatsNonRevendus![0];
      component.suppressionAchat({
        event: new MouseEvent('click'),
        achatValeurDecore: achat
      });
      expect(dialogueService.confirmationSuppression).toHaveBeenCalled();
      const onSuppression: Function = (dialogueService.confirmationSuppression as jasmine.Spy).calls.mostRecent().args[3];
      onSuppression();
      expect(mockValeursService.enregistrerAchatsTicker).toHaveBeenCalledWith(achat.valeur.ticker, []);
    });

    it('when #ngOnInit et #recupererCours then les cours sont bien récupérés', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      component.recupererCours();
      expect(component.dialogCoursAchatsNonRevendusComponent()).toBeDefined();
      const dialog: DialogCoursAchatsComponent = component.dialogCoursAchatsNonRevendusComponent()!;
      expect(dialog.achats).toBeDefined();
      expect(dialog.achats).toHaveSize(nbAchats);
      if (dialog.achats)
        for (const achat of dialog.achats) {
          expect(achat.achatDecore.cours).toBeDefined()
        }
    });
  });
});
