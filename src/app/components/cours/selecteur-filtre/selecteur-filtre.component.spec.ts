import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelecteurFiltreComponent} from './selecteur-filtre.component';
import {CoursService} from '../../../services/cours/cours.service';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {FILTRES} from '../../../services/jdd/jdd-cours.dataset';

describe('SelecteurFiltreComponent', () => {
  let component: SelecteurFiltreComponent;
  let fixture: ComponentFixture<SelecteurFiltreComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerFiltres', 'onImportFiltres', 'onUpdateFiltres']);

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Given des filtres', () => {
    beforeEach(() => {
      spyOn(component.selection, "emit");
      mockCoursService.chargerFiltres.and.returnValue(FILTRES);
    });

    it('when #ngOnInit then les filtres sont affichés', () => {
      fixture.detectChanges();
      expect(component.filtresDecores).toHaveSize(FILTRES.length);
      component.appliquerFiltre(component.filtresDecores![0]);
      expect(component.selection.emit).toHaveBeenCalledWith(component.filtresDecores![0]);
    });
  });
});
