import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEvaluationActualitesComponent} from './dialog-evaluation-actualites.component';
import {ZoneBourseService} from '../../../services/zone-bourse/zone-bourse.service';
import {TranslateModule} from '@ngx-translate/core';
import {DTOValeur} from '../../../services/valeurs/dto-valeur.interface';
import {VALEURS} from '../../../services/jdd/jdd-valeurs.dataset';
import {of} from 'rxjs';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    const valeurByTicker = new Map<string, DTOValeur>();
    VALEURS.forEach(valeur => valeurByTicker!.set(valeur.ticker, valeur));
    mockZoneBourseService.chargerActualites.and.returnValue(of([]));
    fixture.componentRef.setInput('valeurs', valeurByTicker);
    component.reinitialiserVue();
  });
});
