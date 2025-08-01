import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelecteurFiltreComponent} from './selecteur-filtre.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';

describe('SelecteurFiltreComponent', () => {
  let component: SelecteurFiltreComponent;
  let fixture: ComponentFixture<SelecteurFiltreComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerFiltres']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SelecteurFiltreComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService},
        ConfirmationService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelecteurFiltreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
