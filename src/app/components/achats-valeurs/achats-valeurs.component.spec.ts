import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsValeursComponent} from './achats-valeurs.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {CoursService} from '../../services/cours/cours.service';
import {COURS_BNP, COURS_GLE, LISTE_COURS_AVEC_LISTE_ALLEGEE} from '../../services/jdd/jdd-cours.dataset';
import {BoursoramaService} from '../../services/boursorama/boursorama.service';
import {DialogCoursAchatsComponent} from './dialog-cours-achats/dialog-cours-achats.component';
import {ConfirmationService} from 'primeng/api';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {DIVIDENDES_BY_TICKER} from '../../services/jdd/jdd-dividendes.dataset';

describe('AchatsValeursComponent', () => {
  let component: AchatsValeursComponent;
  let fixture: ComponentFixture<AchatsValeursComponent>;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS));

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['onUpdateAchats', 'onImportAchats', 'chargerValeurs', 'chargerAchats', 'enregistrerAchatsTicker', 'chargerAchatsTicker']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);
  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);
  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['chargerMapByTicker']);

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
        {provide: DividendesService, useValue: mockDividendesService},
        ConfirmationService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AchatsValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    const nbAchats: number = 4;
    const nbOrdresAchats: number = 1;
    const nbOrdresVentes: number = 1;
    const nbVentes: number = 1;

    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
      mockValeursService.chargerAchats.and.returnValue(cloneACHATS());
      mockValeursService.chargerAchatsTicker.and.returnValue(cloneACHATS()[1].achats);
      mockCoursService.chargerCoursTickersWithLimit.and.returnValue(of(LISTE_COURS_AVEC_LISTE_ALLEGEE));
      mockBoursoramaService.chargerCoursTickers.and.returnValue(of([COURS_GLE, COURS_BNP]));
      mockDividendesService.chargerMapByTicker.and.returnValue(DIVIDENDES_BY_TICKER);
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      expect(component.achats).toHaveSize(nbAchats);
    });

    it('when #ngOnInit et #recupererCours then les cours sont bien récupérés', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      component.recupererCours();
      fixture.detectChanges();
      expect(component.dialogCoursAchatsNonRevendusComponent()).toBeDefined();
      const dialog: DialogCoursAchatsComponent = component.dialogCoursAchatsNonRevendusComponent()!;

      expect(component.achats).toHaveSize(nbAchats);
      expect(component.ordresAchats).toHaveSize(nbOrdresAchats);
      expect(component.ordresVentes).toHaveSize(nbOrdresVentes);
      expect(component.ventes).toHaveSize(nbVentes);

      expect(dialog.achats).toHaveSize(nbAchats);
      if (dialog.achats) {
        for (const achat of dialog.achats) {
          expect(achat.achatDecore.cours).toBeDefined()
        }
      }

      expect(dialog.ordresAchats).toHaveSize(nbOrdresAchats);
      expect(dialog.ordresVentes).toHaveSize(nbOrdresVentes);
      expect(dialog.loading).toBeFalse();
    });
  });
});
