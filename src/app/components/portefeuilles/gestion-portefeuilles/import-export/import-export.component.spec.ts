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

  describe('Given des portefeuilles', () => {
    beforeEach(() => {
      component.configurationPortefeuilles = portefeuilles;
      fixture.detectChanges();
    });

    it('when on importe then l\'export renvoie les portefeuilles importés', fakeAsync(() => {
      component.importer();
      component.reinitialiser();
      component.exporter();
      expect(component.configurationPortefeuilles).toEqual(portefeuilles);
    }));
  });
});
