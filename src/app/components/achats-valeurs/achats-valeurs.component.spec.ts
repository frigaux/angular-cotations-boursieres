import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsValeursComponent} from './achats-valeurs.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {DialogueService} from '../../services/dialogue/dialogue.service';

describe('AchatsValeursComponent', () => {
  let dialogueService: DialogueService;
  let component: AchatsValeursComponent;
  let fixture: ComponentFixture<AchatsValeursComponent>;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS));

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['onImportAchats', 'chargerValeurs', 'chargerAchats', 'enregistrerAchatsTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AchatsValeursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        provideHttpClient(),
        provideHttpClientTesting(),
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
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
      mockValeursService.chargerAchats.and.returnValue(cloneACHATS());
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      expect(component.achatsValeursDecores).toHaveSize(ACHATS.length);
      expect(component.totalPrix).toEqual(2085);
      expect(component.totalQuantite).toEqual(40);
      expect(component.achatsValeursDecores![0].valeur).toEqual(VALEURS[1]);
      expect(component.achatsValeursDecores![1].valeur).toEqual(VALEURS[0]);
    });


    it('when #ngOnInit et #suppressionAchat then l\'achat est bien supprimé', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      spyOn(dialogueService, 'confirmationSuppression').and.callThrough();
      const achatsTicker = component.achatsValeursDecores![0].achatsTicker;
      component.suppressionAchat(new MouseEvent('click'), achatsTicker, achatsTicker.achats[0]);
      expect(dialogueService.confirmationSuppression).toHaveBeenCalled();
      const onSuppression: Function = (dialogueService.confirmationSuppression as jasmine.Spy).calls.mostRecent().args[3];
      onSuppression();
      expect(component.achatsValeursDecores![0].achatsTicker.achats).toHaveSize(0);
    });
  });
});
