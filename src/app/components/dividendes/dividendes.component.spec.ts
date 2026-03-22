import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DividendesComponent} from './dividendes.component';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {DividendesService} from '../../services/dividendes/dividendes.service';
import {TranslateModule} from '@ngx-translate/core';

describe('DividendesComponent', () => {
  let component: DividendesComponent;
  let fixture: ComponentFixture<DividendesComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockDividendesService = jasmine.createSpyObj('DividendesService', ['charger', 'enregistrer', 'onImportDividendes']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DividendesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: DividendesService, useValue: mockDividendesService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DividendesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
