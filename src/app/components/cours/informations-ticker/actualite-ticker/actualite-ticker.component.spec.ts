import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteTickerComponent } from './actualite-ticker.component';
import {AbcBourseService} from '../../../../services/abc-bourse/abc-bourse.service';

describe('ActualiteComponent', () => {
  let component: ActualiteTickerComponent;
  let fixture: ComponentFixture<ActualiteTickerComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerActualiteTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteTickerComponent],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
