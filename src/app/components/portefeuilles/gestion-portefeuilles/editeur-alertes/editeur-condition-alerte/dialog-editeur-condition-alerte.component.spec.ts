import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEditeurConditionAlerteComponent} from './dialog-editeur-condition-alerte.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../../../../services/jdd/jdd-portefeuilles.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('EditeurConditionAlerteComponent', () => {
  let component: DialogEditeurConditionAlerteComponent;
  let fixture: ComponentFixture<DialogEditeurConditionAlerteComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogEditeurConditionAlerteComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogEditeurConditionAlerteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given une alerte en input', () => {
    beforeEach(() => {
      spyOn(component.modifie, "emit");
      fixture.componentRef.setInput('alerte', clonePORTEFEUILLES()[0].alertes[0]);
    });

    it('when #intercepteurAlerte then l\'alerte passe en édition', () => {
      fixture.detectChanges();
      expect(component).toBeDefined();
      expect(component.alerteEnModification).toEqual(PORTEFEUILLES[0].alertes[0]);
      expect(component.formulaire.get('condition')!.value).toEqual(PORTEFEUILLES[0].alertes[0].condition);
    });

    it('when #modifierConditionAlerte avec une condition invalide then il n\'y a pas modification de la condition de l\'alerte', () => {
      fixture.detectChanges();
      const conditionInvalide = ' x1 <> x2';
      component.formulaire.get('condition')?.setValue(conditionInvalide);
      component.modifierConditionAlerte();
      expect(component.modifie.emit).toHaveBeenCalledTimes(0);
    });

    it('when #modifierConditionAlerte avec une condition valide then il y a modification de la condition de l\'alerte', () => {
      fixture.detectChanges();
      const conditionValide = 'C1 < M1';
      component.formulaire.get('condition')?.setValue(conditionValide);
      component.modifierConditionAlerte();
      expect(component.modifie.emit).toHaveBeenCalledWith(conditionValide);
    });
  });
});
