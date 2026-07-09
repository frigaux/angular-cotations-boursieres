import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCoursAchatsComponent} from './dialog-cours-achats.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {of} from 'rxjs';
import {VALEURS} from '../../../services/jdd/jdd-valeurs.dataset';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {DIVIDENDES_BY_TICKER} from '../../../services/jdd/jdd-dividendes.dataset';

describe('DialogCoursAchatsComponent', () => {
  let component: DialogCoursAchatsComponent;
  let fixture: ComponentFixture<DialogCoursAchatsComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);
  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['chargerMapByTicker']);


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCoursAchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: DividendesService, useValue: mockDividendesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogCoursAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #chargerCoursTickers et #chargerMapByTicker renvoie des données', () => {
    beforeEach(() => {
      mockBoursoramaService.chargerCoursTickers.and.returnValue(of(VALEURS));
      mockDividendesService.chargerMapByTicker.and.returnValue(DIVIDENDES_BY_TICKER);
    });

    it('when #afficherCours then les achats sont affichés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
    });
  });
});
