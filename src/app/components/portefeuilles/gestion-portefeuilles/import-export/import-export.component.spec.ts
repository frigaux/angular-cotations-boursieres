import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {ImportExportComponent} from './import-export.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../../../services/jdd/jdd-portefeuille.dataset';

describe('ImportExportComponent', () => {
  let component: ImportExportComponent;
  let fixture: ComponentFixture<ImportExportComponent>;

  const portefeuilles = JSON.stringify(PORTEFEUILLES);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImportExportComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImportExportComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('when #exemple then le textarea est initialisé avec un exemple de portefeuille', () => {
    component.reinitialiserVue();
    expect(component.configurationPortefeuilles).toEqual('');
    fixture.detectChanges();
    component.exemple();
    expect(component.configurationPortefeuilles.length).toBeGreaterThan(0)
  });

  describe('Given des portefeuilles', () => {
    beforeEach(() => {
      component.configurationPortefeuilles = portefeuilles;
      fixture.detectChanges();
    });

    it('when on #importer then #exporter renvoie les portefeuilles importés', fakeAsync(() => {
      component.importer();
      component.reinitialiserVue();
      component.exporter();
      expect(component.configurationPortefeuilles).toEqual(portefeuilles);
    }));

    it('when #importer puis #toutSupprimer then #exporter ne renvoie aucun portefeuille', fakeAsync(() => {
      component.importer();
      component.reinitialiserVue();
      component.toutSupprimer();
      component.exporter();
      expect(component.configurationPortefeuilles).toEqual('[]');
    }));
  });
});
