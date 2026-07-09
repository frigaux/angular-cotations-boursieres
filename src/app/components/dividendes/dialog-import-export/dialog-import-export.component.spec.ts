import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogImportExportComponent} from './dialog-import-export.component';
import {TranslateModule} from '@ngx-translate/core';
import {DividendesService} from '../../../services/dividendes/dividendes.service';
import {DIVIDENDES_TICKER_GLE} from '../../../services/jdd/jdd-dividendes.dataset';
import {Subject} from 'rxjs';
import {DTODividendes} from '../../../services/dividendes/dto-dividendes.class';

describe('DialogImportExportComponent', () => {
  let component: DialogImportExportComponent;
  let fixture: ComponentFixture<DialogImportExportComponent>;

  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['charger', 'enregistrer', 'onUpdate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogImportExportComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: DividendesService, useValue: mockDividendesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogImportExportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given #onUpdate', () => {
    beforeEach(() => {
      mockDividendesService.charger.and.returnValue(DIVIDENDES_TICKER_GLE);
      mockDividendesService.onUpdate.and.returnValue(new Subject<DTODividendes>());
      component.dividendes = '<table class="tablesorter tbl100_10 mt15" id="tabQuotes">\n' +
        '        <thead>\n' +
        '            <tr>\n' +
        '                <th role="columnheader">Date</th>\n' +
        '                <th role="columnheader">Valeur</th>\n' +
        '                <th role="columnheader">Type</th>\n' +
        '                    <th role="columnheader">Montant (€)</th>\n' +
        '                    <th role="columnheader">Rendement</th>\n' +
        '\n' +
        '            </tr>\n' +
        '        </thead>\n' +
        '        <tbody>\n' +
        '<tr><td>01/07/2026</td><td><a href="/cotation/IPSp">Ipsos</a></td><td class="alct">Détachement</td><td>2,00</td><td>5,90%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/ALEROp">Euroland Corporate</a></td><td class="alct">Détachement</td><td>0,12</td><td>3,97%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/PUBp">Publicis Groupe</a><span class="fr f12 co_g2">CAC 40</span></td><td class="alct">Détachement</td><td>3,75</td><td>4,41%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/GLOp">Gl Events</a></td><td class="alct">Détachement</td><td>1,00</td><td>3,11%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/ALHEXp">Hexaom</a></td><td class="alct">Détachement</td><td>0,49</td><td>1,66%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/FREYp">Frey</a></td><td class="alct">Détachement</td><td>2,00</td><td>5,68%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/ALHFp">Hf Company</a></td><td class="alct">Détachement</td><td>0,55</td><td>12,50%</td></tr><tr><td>01/07/2026</td><td><a href="/cotation/MLSJAp">Saja Real Estate</a></td><td class="alct">Détachement (solde)</td><td>0,04</td><td>0,40%</td></tr><tr><td>02/07/2026</td><td><a href="/cotation/ALTOUp">Touax</a></td><td class="alct">Détachement</td><td>0,10</td><td>2,42%</td></tr><tr><td>02/07/2026</td><td><a href="/cotation/CENp">Groupe Crit</a></td><td class="alct">Détachement</td><td>1,50</td><td>3,00%</td></tr><tr><td>02/07/2026</td><td><a href="/cotation/VIRPp">Virbac</a></td><td class="alct">Détachement</td><td>1,45</td><td>0,46%</td></tr><tr><td>03/07/2026</td><td><a href="/cotation/LIp">Klepierre</a></td><td class="alct">Détachement (solde)</td><td>0,95</td><td>2,65%</td></tr><tr><td>03/07/2026</td><td><a href="/cotation/ALDELp">Delfingen</a></td><td class="alct">Détachement</td><td>1,73</td><td>5,81%</td></tr><tr><td>03/07/2026</td><td><a href="/cotation/ABLDp">ABL Diagnostics</a></td><td class="alct">Détachement</td><td>0,11</td><td>4,40%</td></tr><tr><td>03/07/2026</td><td><a href="/cotation/MLVSTp">Televista</a></td><td class="alct">Détachement</td><td>0,02</td><td>0,88%</td></tr><tr><td>06/07/2026</td><td><a href="/cotation/ALHOPp">Hopscotch Groupe</a></td><td class="alct">Détachement</td><td>0,50</td><td>2,91%</td></tr><tr><td>06/07/2026</td><td><a href="/cotation/ALITLp">It Link</a></td><td class="alct">Détachement</td><td>0,50</td><td>3,26%</td></tr><tr><td>07/07/2026</td><td><a href="/cotation/GFCp">Gecina Nom.</a></td><td class="alct">Détachement (solde)</td><td>2,75</td><td>3,95%</td></tr><tr><td>07/07/2026</td><td><a href="/cotation/ATLDp">Atland</a></td><td class="alct">Détachement</td><td>1,75</td><td>5,09%</td></tr><tr><td>07/07/2026</td><td><a href="/cotation/ALQWAp">Qwamplify</a></td><td class="alct">Détachement</td><td>0,10</td><td>6,10%</td></tr><tr><td>07/07/2026</td><td><a href="/cotation/MRNp">Mersen</a></td><td class="alct">Détachement</td><td>0,90</td><td>2,30%</td></tr><tr><td>08/07/2026</td><td><a href="/cotation/SCHPp">Seche Environnement</a></td><td class="alct">Détachement</td><td>1,20</td><td>1,58%</td></tr><tr><td>08/07/2026</td><td><a href="/cotation/ALNTGp">Netgem</a></td><td class="alct">Détachement</td><td>0,05</td><td>5,95%</td></tr><tr><td>08/07/2026</td><td><a href="/cotation/ALRISp">Rising Stone</a></td><td class="alct">Détachement</td><td>1,55</td><td>3,10%</td></tr><tr><td>08/07/2026</td><td><a href="/cotation/MLOKPp">Ok Properties I Socimi</a></td><td class="alct">Détachement</td><td>0,13</td><td>1,12%</td></tr><tr><td>14/07/2026</td><td><a href="/cotation/MLASOp">Apodaca Inversiones Inmobilarias</a></td><td class="alct">Détachement (solde)</td><td>0,59</td><td>0,86%</td></tr><tr><td>15/07/2026</td><td><a href="/cotation/COVp">Covivio</a></td><td class="alct">Détachement (solde)</td><td>2,25</td><td>4,23%</td></tr><tr><td>15/07/2026</td><td><a href="/cotation/ASYp">Assystem</a></td><td class="alct">Détachement</td><td>1,00</td><td>2,36%</td></tr><tr><td>15/07/2026</td><td><a href="/cotation/LINp">Linedata Services</a></td><td class="alct">Détachement</td><td>1,20</td><td>2,83%</td></tr><tr><td>15/07/2026</td><td><a href="/cotation/ALESEp">Entech</a></td><td class="alct">Détachement</td><td>0,07</td><td>0,66%</td></tr><tr><td>20/07/2026</td><td><a href="/cotation/ALDNXp">DNXCorp</a></td><td class="alct">Détachement</td><td>2,50</td><td>12,85%</td></tr><tr><td>27/07/2026</td><td><a href="/cotation/MLAGPp">Agp Malaga Socimi</a></td><td class="alct">Détachement</td><td>0,13</td><td>4,39%</td></tr><tr><td>28/07/2026</td><td><a href="/cotation/RCOp">Remy Cointreau</a></td><td class="alct">Détachement</td><td>0,25</td><td>0,59%</td></tr><tr><td>29/07/2026</td><td><a href="/cotation/PATp">Patrimoine et Commerce</a></td><td class="alct">Détachement</td><td>1,40</td><td>5,34%</td></tr><tr><td>31/07/2026</td><td><a href="/cotation/ALGTRp">Groupe Tera</a></td><td class="alct">Détachement</td><td>1,00</td><td>16,67%</td></tr>        </tbody>\n' +
        '    </table>';
    });

    it('when #ngOnInit then les mois déjà importés sont affichés', () => {
      component.ngOnInit();
      fixture.detectChanges(); // appelle le ngOnInit
      component.construireVue();
      expect(component.moisDejaImportes).toHaveSize(1);
      component.importer();
      expect(mockDividendesService.enregistrer).toHaveBeenCalled();
    });
  });
});
