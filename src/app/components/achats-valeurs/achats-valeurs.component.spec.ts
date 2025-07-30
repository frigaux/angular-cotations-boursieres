import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AchatsValeursComponent} from './achats-valeurs.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {Valeur} from '../valeurs/valeur.class';

describe('AchatsValeursComponent', () => {
  let component: AchatsValeursComponent;
  let fixture: ComponentFixture<AchatsValeursComponent>;

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

    fixture = TestBed.createComponent(AchatsValeursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    const valeur: Valeur = new Valeur(VALEURS[0], '');

    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
      mockValeursService.chargerAchats.and.returnValue(ACHATS);
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      expect(component.achatsValeursDecores).toHaveSize(ACHATS.length);
    });
  });
});
