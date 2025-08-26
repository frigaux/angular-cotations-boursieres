import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualitesComponent } from './actualites.component';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {TranslateModule} from '@ngx-translate/core';

describe('ActualitesComponent', () => {
  let component: ActualitesComponent;
  let fixture: ComponentFixture<ActualitesComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerActualites']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActualitesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
