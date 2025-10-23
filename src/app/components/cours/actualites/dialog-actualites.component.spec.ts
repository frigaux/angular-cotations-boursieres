import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogActualitesComponent} from './dialog-actualites.component';
import {AbcBourseService} from '../../../services/abc-bourse/abc-bourse.service';
import {TranslateModule} from '@ngx-translate/core';
import {DTOActualites} from '../../../services/abc-bourse/dto-actualites.class';
import {of} from 'rxjs';
import {DTOTransaction} from '../../../services/abc-bourse/dto-transaction.class';

describe('DialogActualitesComponent', () => {
  let component: DialogActualitesComponent;
  let fixture: ComponentFixture<DialogActualitesComponent>;

  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerActualites']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogActualitesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: AbcBourseService, useValue: mockAbcBourseService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogActualitesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerActualites renvoie les actualités', () => {
    beforeEach(() => {
      const actualites = new DTOActualites();
      actualites.marches = '';
      actualites.transactionsDirigeants = [
        new DTOTransaction(0, '', '', '', 'Acquisition', '', 6, '', '', 3, 2),
        new DTOTransaction(1, '', '', '', 'Acquisition', '', 4, '', '', 2, 2),
        new DTOTransaction(2, '', '', '', 'Cession', '', 2, '', '', 2, 1),
        new DTOTransaction(3, '', '', '', 'Cession', '', 4, '', '', 2, 2)
      ];
      mockAbcBourseService.chargerActualites.and.returnValue(of(actualites));
    });

    it('when #reinitialiserVue then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      component.reinitialiserVue();
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
    });
  });

});
