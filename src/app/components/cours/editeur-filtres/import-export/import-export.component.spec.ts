import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ImportExportComponent} from './import-export.component';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import {FILTRES} from '../../../../services/jdd/jdd-cours.dataset';

describe('ImportExportComponent', () => {
  let component: ImportExportComponent;
  let fixture: ComponentFixture<ImportExportComponent>;

  const filtres = JSON.stringify(FILTRES, null, 2);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImportExportComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
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

  describe('Given des filtres', () => {
    beforeEach(() => {
      component.filtres = filtres;
      fixture.detectChanges();
    });

    it('when on #importer then #exporter renvoie les filtres importés', fakeAsync(() => {
      component.importer();
      component.reinitialiserVue();
      component.exporter();
      expect(component.filtres).toEqual(filtres);
    }));
  });
});
