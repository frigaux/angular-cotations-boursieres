import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValeurComponent } from './valeur.component';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../../services/valeurs/valeurs.service';
import {CoursService} from '../../../services/cours/cours.service';

describe('ValeurComponent', () => {
  let component: ValeurComponent;
  let fixture: ComponentFixture<ValeurComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTicker', 'chargerCoursTickerWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
