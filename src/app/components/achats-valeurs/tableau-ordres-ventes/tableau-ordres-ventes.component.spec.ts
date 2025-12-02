import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauOrdresVentesComponent} from './tableau-ordres-ventes.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauOrdresVentesComponent', () => {
  let component: TableauOrdresVentesComponent;
  let fixture: ComponentFixture<TableauOrdresVentesComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauOrdresVentesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
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
