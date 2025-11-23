import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAchatsNonRevendusComponent} from './tableau-achats-non-revendus.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';

describe('TableauAchatsNonRevendusComponent', () => {
  let component: TableauAchatsNonRevendusComponent;
  let fixture: ComponentFixture<TableauAchatsNonRevendusComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableauAchatsNonRevendusComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauAchatsNonRevendusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
