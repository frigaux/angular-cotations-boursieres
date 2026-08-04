import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Indicateurs} from './indicateurs';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {of} from 'rxjs';
import {LISTE_COURS_TICKER_ALLEGE} from '../../../services/jdd/jdd-cours.dataset';

describe('Indicateurs', () => {
  let component: Indicateurs;
  let fixture: ComponentFixture<Indicateurs>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCoursTickerWithLimit']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Indicateurs,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Indicateurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Given #chargerCoursTickerWithLimit renvoie les cours d\'un ticker', () => {
    beforeEach(() => {
      mockCoursService.chargerCoursTickerWithLimit.and.returnValue(of(LISTE_COURS_TICKER_ALLEGE));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
