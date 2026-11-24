import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogCoursAchatsComponent} from './dialog-cours-achats.component';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {of} from 'rxjs';
import {ACHATS, VALEURS} from '../../../services/jdd/jdd-valeurs.dataset';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {DIVIDENDES_BY_TICKER} from '../../../services/jdd/jdd-dividendes.dataset';
import {EtapeValeurUtil} from '../../valeurs/achats-valeur/etape-valeur-util.class';
import {EtapeValeur} from '../../valeurs/achats-valeur/etape-valeur.enum';
import {AchatValeurDecore} from '../tableau-achats/achat-valeur-decore.class';
import {AchatDecore} from '../../valeurs/achats-valeur/achat-decore.class';
import {PercentPipe} from '@angular/common';
import {COURS_BNP, COURS_GLE} from '../../../services/jdd/jdd-cours.dataset';

describe('DialogCoursAchatsComponent', () => {
  let component: DialogCoursAchatsComponent;
  let fixture: ComponentFixture<DialogCoursAchatsComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerCoursTickers']);
  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['chargerMapByTicker']);

  const cloneACHATS: Function = () => JSON.parse(JSON.stringify(ACHATS));

  let jdd = (etape: EtapeValeur): AchatValeurDecore[] => {
    const resultat: AchatValeurDecore[] = [];
    const achats = EtapeValeurUtil.filtrerParEtape(cloneACHATS(), etape);
    let i = 0;
    VALEURS.forEach((valeur) => {
      achats.forEach(achat => {
        if (achat.ticker === valeur.ticker) {
          achat.achats.forEach(achat => {
            resultat.push(new AchatValeurDecore(valeur, new AchatDecore(i++, achat)));
          });
        }
      });
    });
    return resultat;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogCoursAchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: DividendesService, useValue: mockDividendesService},
        PercentPipe
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
      mockBoursoramaService.chargerCoursTickers.and.returnValue(of([COURS_GLE, COURS_BNP]));
      mockDividendesService.chargerMapByTicker.and.returnValue(DIVIDENDES_BY_TICKER);
    });

    it('when #afficherCours then les achats sont affichés', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      component.afficherCours(jdd(EtapeValeur.ORDRE_ACHAT), jdd(EtapeValeur.ACHAT), jdd(EtapeValeur.ORDRE_VENTE));
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component.ordresAchats).toHaveSize(1);
      expect(component.achats).toHaveSize(4);
      expect(component.ordresVentes).toHaveSize(1);
      component.achats?.forEach((achat) => {
        expect(achat.achatDecore.cours).toBeDefined();
        expect(achat.achatDecore.dto).toBeDefined();
      });
    });
  });
});
