import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEvaluationActualitesComponent} from './dialog-evaluation-actualites.component';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';
import {PortefeuillesService} from '../../../services/portefeuilles/portefeuilles.service';
import {TranslateModule} from '@ngx-translate/core';
import {BoursoramaService} from '../../../services/boursorama/boursorama.service';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';

describe('DialogConseils', () => {
  let component: DialogEvaluationActualitesComponent;
  let fixture: ComponentFixture<DialogEvaluationActualitesComponent>;

  const mockBoursoramaService = jasmine.createSpyObj('BoursoramaService', ['chargerLien']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerLien']);
  const mockZoneBourseService = jasmine.createSpyObj('ZoneBourseService', ['chargerActualites']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogEvaluationActualitesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: BoursoramaService, useValue: mockBoursoramaService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
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
