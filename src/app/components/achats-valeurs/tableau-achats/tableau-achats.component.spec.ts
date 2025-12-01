import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAchatsComponent} from './tableau-achats.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauAchatsComponent', () => {
  let component: TableauAchatsComponent;
  let fixture: ComponentFixture<TableauAchatsComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauAchatsComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
