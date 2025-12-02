import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauOrdresAchatsComponent} from './tableau-ordres-achats.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauOrdresAchatsComponent', () => {
  let component: TableauOrdresAchatsComponent;
  let fixture: ComponentFixture<TableauOrdresAchatsComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauOrdresAchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauOrdresAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
