import {ComponentFixture, TestBed} from '@angular/core/testing';

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
    expect(component).toBeTruthy();
  });

  describe('Given un clipboard avec des portefeuilles', () => {
    beforeEach(() => {
      spyOn(navigator.clipboard, 'readText').and.returnValue(new Promise(resolve => resolve(portefeuilles)));
      spyOn(navigator.clipboard, 'writeText');
      fixture.detectChanges();
    });

    it('when on importe then l\'export renvoie les portefeuilles importés', () => {
      component.importer();
      fixture.detectChanges();
      component.exporter(); // waiting Promise resolve
      fixture.detectChanges();
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(portefeuilles);
    });
  });
});
