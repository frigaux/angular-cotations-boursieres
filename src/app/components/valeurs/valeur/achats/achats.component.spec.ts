import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsComponent} from './achats.component';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {TranslateModule} from '@ngx-translate/core';
import {ACHATS} from '../../../../services/jdd/jdd-valeurs.dataset';
import {AchatsTicker} from '../../../../services/valeurs/achats-ticker.interface';

describe('AchatsComponent', () => {
  let component: AchatsComponent;
  let fixture: ComponentFixture<AchatsComponent>;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS), ValeursService.reviverAchatsTicker);

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerAchats', 'enregistrerAchats']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des achats existants et un ticker en input', () => {
    let achatsTickers: Array<AchatsTicker>;

    beforeEach(() => {
      achatsTickers = cloneACHATS();
      mockValeursService.chargerAchats.and.returnValue(achatsTickers);
      mockValeursService.enregistrerAchats.and.returnValue(undefined);
      fixture.componentRef.setInput('ticker', achatsTickers[0].ticker);
    });

    it('when initialisé then les achats sont chargés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component.achatsDecores).toHaveSize(achatsTickers[0].achats.length);
    });

    it('when #ajouterAchat then l\'achat est bien ajouté à la liste', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.ajouterAchat();
      expect(component.achatsDecores).toHaveSize(ACHATS[0].achats.length + 1);
    });

    it('when #supprimerAchat then l\'achat est bien supprimé de la liste', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.supprimerAchat(ACHATS[0].achats[0]);
      component.enregistrerAchats();
      expect(component.achatsDecores).toHaveSize(ACHATS[0].achats.length - 1);
    });
  });
});
