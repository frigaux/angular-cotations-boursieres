import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauOrdresAchatsComponent} from './tableau-ordres-achats.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {ConfirmationService} from 'primeng/api';
import {DialogueService} from '../../../services/dialogue/dialogue.service';

describe('TableauOrdresAchatsComponent', () => {
  let dialogueService: DialogueService;
  let component: TableauOrdresAchatsComponent;
  let fixture: ComponentFixture<TableauOrdresAchatsComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['onUpdateAchats', 'onImportAchats', 'chargerValeurs', 'chargerAchats', 'enregistrerAchatsTicker', 'chargerAchatsTicker']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);
  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauOrdresAchatsComponent,
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
    fixture = TestBed.createComponent(TableauOrdresAchatsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });


  // it('when #ngOnInit et #annulerOrdreAchat then l\'ordre d\'achat est bien annulé', () => {
  //   fixture.detectChanges(); // appelle le ngOnInit
  //
  //   spyOn(dialogueService, 'confirmationSuppression').and.callThrough();
  //   const achatsNonRevendus = component.achats;
  //   const achat = achatsNonRevendus![0];
  //   component.suppressionAchat({
  //     event: new MouseEvent('click'),
  //     achatValeurDecore: achat
  //   });
  //   expect(dialogueService.confirmationSuppression).toHaveBeenCalled();
  //   const onSuppression: Function = (dialogueService.confirmationSuppression as jasmine.Spy).calls.mostRecent().args[3];
  //   onSuppression();
  //   expect(mockValeursService.enregistrerAchatsTicker).toHaveBeenCalledWith(achat.valeur.ticker, []);
  // });
});
