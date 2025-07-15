import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditeurAlertesComponent} from './editeur-alertes.component';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {PORTEFEUILLES} from '../../../../services/jdd/jdd-portefeuilles.dataset';
import {DTOAlerte} from '../../../../services/portefeuilles/dto-alerte.interface';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('EditeurAlertesComponent', () => {
  let component: EditeurAlertesComponent;
  let fixture: ComponentFixture<EditeurAlertesComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EditeurAlertesComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ConfirmationService},
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditeurAlertesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given un portefeuille en input', () => {
    beforeEach(() => {
      spyOn(component.modifie, "emit");
      fixture.componentRef.setInput('portefeuille', clonePORTEFEUILLES()[0]);
    });

    it('when #intercepteurPortefeuille then les alertes passent en édition', () => {
      fixture.detectChanges();
      expect(component).toBeDefined();
      expect(component.portefeuilleEnModification).toEqual(PORTEFEUILLES[0]);
      expect(component.alertes).toEqual(PORTEFEUILLES[0].alertes);
    });

    it('when #ajouterAlerte then une nouvelle alerte est crée', () => {
      fixture.detectChanges();
      component.ajouterAlerte();
      const expected = clonePORTEFEUILLES()[0].alertes.concat({nom: '', condition: ''});
      expect(component.alertes).toEqual(expected);
    });

    it('when #editionAlertes puis #modifierConditionAlerte then la condition de l\'alerte est bien modifiée', () => {
      fixture.detectChanges();
      component.editionAlertes(0);
      const expected = 'M20 < M10';
      component.modifierConditionAlerte(expected);
      expect(component.alertes[0].condition).toEqual(expected);
    });

    it('when #supprimerAlerte then l\'alerte est bien supprimée', () => {
      fixture.detectChanges();
      component.supprimerAlerte(0);
      const expected: Array<DTOAlerte> = clonePORTEFEUILLES()[0].alertes;
      expected.splice(0, 1);
      expect(component.alertes).toEqual(expected);
    });

    it('when #modifierAlertesPortefeuille then il y a édition des alertes du portefeuille', () => {
      fixture.detectChanges();
      component.ajouterAlerte();
      const expected = clonePORTEFEUILLES()[0].alertes.concat({nom: '', condition: ''});
      component.modifierAlertesPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledWith(expected);
    });
  });
});
