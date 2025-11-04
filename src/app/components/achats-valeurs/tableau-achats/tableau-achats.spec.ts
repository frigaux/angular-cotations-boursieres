import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableauAchats} from './tableau-achats';
import {CoursService} from '../../../services/cours/cours.service';

describe('TableauAchats', () => {
  let component: TableauAchats;
  let fixture: ComponentFixture<TableauAchats>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickersWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauAchats],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableauAchats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
