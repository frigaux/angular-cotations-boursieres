import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEditeurFiltresComponent} from './dialog-editeur-filtres.component';
import {TranslateModule} from '@ngx-translate/core';
import {CoursService} from '../../../services/cours/cours.service';
import {ConfirmationService} from 'primeng/api';
import {DTOAlerte} from '../../../services/portefeuilles/dto-alerte.interface';
import {FILTRES} from '../../../services/jdd/jdd-cours.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('DialogEditeurFiltreComponent', () => {
  let component: DialogEditeurFiltresComponent;
  let fixture: ComponentFixture<DialogEditeurFiltresComponent>;

  const mockCoursService = jasmine.createSpyObj('CoursService', ['chargerFiltres', 'enregistrerFiltres']);

  const cloneFILTRES: Function = () => JSON.parse(JSON.stringify(FILTRES));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogEditeurFiltresComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: CoursService, useValue: mockCoursService},
        ConfirmationService,
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogEditeurFiltresComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given visible en input', () => {
    beforeEach(() => {
      mockCoursService.chargerFiltres.and.returnValue(cloneFILTRES());
      spyOn(component.visibleChange, "emit");
      fixture.componentRef.setInput('visible', true);
    });

    it('when #intercepteurVisible then les filtres passent en édition', () => {
      fixture.detectChanges();
      expect(component.filtres).toEqual(FILTRES);
    });

    it('when #ajouterFiltre then une nouveau filtre est crée', () => {
      fixture.detectChanges();
      component.ajouterFiltre();
      const expected = cloneFILTRES().concat({nom: '', condition: ''});
      expect(component.filtres).toEqual(expected);
    });

    it('when #editionFiltre puis #modifierConditionFiltre then la condition du filtre est bien modifiée', () => {
      fixture.detectChanges();
      component.editionFiltre(0);
      const expected = 'M20 < M10';
      component.modifierConditionFiltre(expected);
      expect(component.filtres[0].condition).toEqual(expected);
    });

    it('when #supprimerFiltre then le filtre est bien supprimé', () => {
      fixture.detectChanges();
      component.supprimerFiltre(0);
      const expected: Array<DTOAlerte> = cloneFILTRES();
      expected.splice(0, 1);
      expect(component.filtres).toEqual(expected);
    });

    it('when #modifierFiltresPortefeuille then il y a édition des filtres du portefeuille', () => {
      fixture.detectChanges();
      component.ajouterFiltre();
      const expected = cloneFILTRES().concat({nom: '', condition: ''});
      component.modifierFiltresPortefeuille();
      expect(component.filtres).toEqual(expected);
      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    });
  });
});
