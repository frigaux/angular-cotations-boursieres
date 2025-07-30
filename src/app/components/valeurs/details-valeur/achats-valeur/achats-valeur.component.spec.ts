import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsValeurComponent} from './achats-valeur.component';
import {ValeursService} from '../../../../services/valeurs/valeurs.service';
import {TranslateModule} from '@ngx-translate/core';
import {ACHATS} from '../../../../services/jdd/jdd-valeurs.dataset';
import {AchatsTicker} from '../../../../services/valeurs/achats-ticker.interface';
import {DatePipe} from '@angular/common';
import {ConfirmationService} from 'primeng/api';

describe('AchatsValeurComponent', () => {
  let component: AchatsValeurComponent;
  let fixture: ComponentFixture<AchatsValeurComponent>;

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS));

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerAchatsTicker', 'enregistrerAchatsTicker', 'onImportAchats']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AchatsValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        ConfirmationService,
        DatePipe
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AchatsValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des achats existants et un ticker en input', () => {
    let achatsTickers: Array<AchatsTicker>;

    beforeEach(() => {
      achatsTickers = cloneACHATS();
      mockValeursService.chargerAchatsTicker.and.returnValue(achatsTickers[0].achats);
      mockValeursService.enregistrerAchatsTicker.and.returnValue(undefined);
      fixture.componentRef.setInput('valeur', {ticker: achatsTickers[0].ticker, cloture: achatsTickers[0].achats[0].prix});
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
