import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEvaluationActualitesComponent} from './dialog-evaluation-actualites.component';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {TranslateModule} from '@ngx-translate/core';

describe('DialogConseils', () => {
  let component: DialogEvaluationActualitesComponent;
  let fixture: ComponentFixture<DialogEvaluationActualitesComponent>;

  const mockZoneBourseService = jasmine.createSpyObj('ZoneBourseService', ['chargerActualites']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogEvaluationActualitesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ZoneBourseService, useValue: mockZoneBourseService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogEvaluationActualitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
