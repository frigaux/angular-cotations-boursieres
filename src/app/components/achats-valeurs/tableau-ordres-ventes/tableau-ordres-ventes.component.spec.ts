import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauOrdresVentesComponent} from './tableau-ordres-ventes.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../../services/valeurs/valeurs.service';

describe('TableauOrdresVentesComponent', () => {
  let component: TableauOrdresVentesComponent;
  let fixture: ComponentFixture<TableauOrdresVentesComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['onUpdateAchats', 'onImportAchats', 'chargerValeurs', 'chargerAchats', 'enregistrerAchatsTicker', 'chargerAchatsTicker']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauOrdresVentesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService},
        {provide: ValeursService, useValue: mockValeursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauOrdresVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
