import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CoursComponent} from './cours.component';
import {CoursService} from '../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';
import {ValeursService} from '../../services/valeurs/valeurs.service';
import {of} from 'rxjs';
import {provideAnimations} from '@angular/platform-browser/animations';
import {VALEUR} from '../../services/jdd/jdd-valeurs.dataset';
import {FILTRES, LISTE_COURS} from '../../services/jdd/jdd-cours.dataset';
import {ConfirmationService, SortEvent} from 'primeng/api';
import {AbcBourseService} from '../../services/abc-bourse/abc-bourse.service';

describe('CoursComponent', () => {
  let component: CoursComponent;
  let fixture: ComponentFixture<CoursComponent>;

  const mockValeursService = jasmine.createSpyObj('ValeursService', ['chargerValeurs']);
  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerCours', 'chargerFiltres',
    'onImportFiltres', 'onUpdateFiltres']);
  const mockAbcBourseService = jasmine.createSpyObj('AbcBourseService', ['chargerActualites']);

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        CoursComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ValeursService, useValue: mockValeursService},
        {provide: CoursService, useValue: mockCoursService},
        {provide: AbcBourseService, useValue: mockAbcBourseService},
        provideAnimations(),
        ConfirmationService
      ]
    });

    fixture = TestBed.createComponent(CoursComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerValeurs et #chargerCours renvoient des valeurs et des cours', () => {
    beforeEach(() => {
      mockValeursService.chargerValeurs.and.returnValue(of([VALEUR]));
      mockCoursService.chargerFiltres.and.returnValue(FILTRES);
      mockCoursService.chargerCours.and.returnValue(of(LISTE_COURS));
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.detectChanges(); // appelle le ngOnInit
      expect(component).toBeDefined();
      expect(component.loading).toBeFalse();
      const cours = component.marches![0].cours[0];
      component.onClickCours(new MouseEvent('click'), cours);
      component.valeurSuivante();
      component.valeurPrecedente();
      component.trierColonne({field: 'libelle'}, component.marches![0]);
      component.trierColonne({field: 'cloture'}, component.marches![0]);
      component.trierColonne({field: 'var1'}, component.marches![0]);
      expect(component.coursSelectionne).toEqual(cours);
    });
  });
});
