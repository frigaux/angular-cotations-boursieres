import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogFormulaireModificationComponent} from './dialog-formulaire-modification.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLE, PORTEFEUILLES} from '../../../../services/jdd/jdd-portefeuilles.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('DialogFormulaireModificationComponent', () => {
  let component: DialogFormulaireModificationComponent;
  let fixture: ComponentFixture<DialogFormulaireModificationComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogFormulaireModificationComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogFormulaireModificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des portefeuilles existants', () => {
    const portefeuilles = clonePORTEFEUILLES();

    beforeEach(() => {
      spyOn(component.modifie, "emit");
      fixture.componentRef.setInput('donnees',
        {portefeuilles, portefeuilleNomEnModification: portefeuilles[0]});
      fixture.detectChanges(); // appelle le ngOnInit
    });

    it('when #modifierPortefeuille sans nom then il n\'y a pas de modification du portefeuille', () => {
      component.formulaire.get('nom')?.setValue('');
      component.modifierNomPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledTimes(0);
    });

    it('when #modifierPortefeuille avec un nom en doublon then il n\'y a pas de modification du portefeuille', () => {
      component.formulaire.get('nom')?.setValue(portefeuilles[1].nom);
      component.modifierNomPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledTimes(0);
    });

    it('when #modifierPortefeuille avec un nom unique then il y a modification du portefeuille', () => {
      component.formulaire.get('nom')?.setValue('nomUnique');
      component.modifierNomPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledWith('nomUnique');
    });
  });
});
