import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {DialogImportExportComponent} from './dialog-import-export.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TABLEAUX} from '../../../../services/jdd/jdd-tableaux.dataset';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('DialogImportExportComponent', () => {
  let component: DialogImportExportComponent;
  let fixture: ComponentFixture<DialogImportExportComponent>;

  const tableaux = JSON.stringify(TABLEAUX, null, 2);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogImportExportComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        DatePipe,
        PercentPipe,
        CurrencyPipe,
        DecimalPipe,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogImportExportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('when #exemple then le textarea est initialisé avec un exemple de configuration', () => {
    component.reinitialiserVue();
    expect(component.configurationTableaux).toEqual('');
    fixture.detectChanges();
    component.exemple('DESKTOP');
    expect(component.configurationTableaux.length).toBeGreaterThan(0)
  });

  describe('Given des tableaux', () => {
    beforeEach(() => {
      component.configurationTableaux = tableaux;
      fixture.detectChanges();
    });

    it('when on #importer then #exporter renvoie les tableaux importés', fakeAsync(() => {
      component.importer();
      component.reinitialiserVue();
      component.exporter();
      expect(component.configurationTableaux).toEqual(tableaux);
    }));
  });
});
