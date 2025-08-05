import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ImportExportComponent} from './import-export.component';
import {TranslateModule} from '@ngx-translate/core';
import {CurrencyPipe, DatePipe, DecimalPipe, PercentPipe} from '@angular/common';
import {TABLEAUX} from '../../../services/jdd/jdd-tableaux.dataset';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('ImportExportComponent', () => {
  let component: ImportExportComponent;
  let fixture: ComponentFixture<ImportExportComponent>;

  const tableaux = JSON.stringify(TABLEAUX, null, 2);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImportExportComponent,
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

    fixture = TestBed.createComponent(ImportExportComponent);
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
