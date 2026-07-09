import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DividendesComponent} from './dividendes.component';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {TranslateModule} from '@ngx-translate/core';
import {of} from 'rxjs';
import {VALEURS} from '../../services/jdd/jdd-valeurs.dataset';
import {DIVIDENDES_TICKER_GLE} from '../../services/jdd/jdd-dividendes.dataset';

describe('DividendesComponent', () => {
  let component: DividendesComponent;
  let fixture: ComponentFixture<DividendesComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['charger', 'onUpdate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DividendesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: DividendesService, useValue: mockDividendesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DividendesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerValeurs renvoie des valeurs', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of(VALEURS));
      mockDividendesService.charger.and.returnValue(DIVIDENDES_TICKER_GLE);
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit

      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });
});
