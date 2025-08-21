import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsTickerComponent } from './informations-ticker.component';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';

describe('InformationsTickerComponent', () => {
  let component: InformationsTickerComponent;
  let fixture: ComponentFixture<InformationsTickerComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerInformationsTicker']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationsTickerComponent],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationsTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
