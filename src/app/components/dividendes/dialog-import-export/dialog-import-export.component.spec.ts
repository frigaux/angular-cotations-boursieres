import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogImportExportComponent} from './dialog-import-export.component';
import {TranslateModule} from '@ngx-translate/core';
import {DividendesService} from '../../../services/dividendes/dividendes.service';

describe('DialogImportExportComponent', () => {
  let component: DialogImportExportComponent;
  let fixture: ComponentFixture<DialogImportExportComponent>;

  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['charger', 'enregistrer']);

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
