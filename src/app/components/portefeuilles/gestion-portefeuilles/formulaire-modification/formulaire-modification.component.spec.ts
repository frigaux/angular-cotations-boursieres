import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormulaireModificationComponent} from './formulaire-modification.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLE, PORTEFEUILLES} from '../../../../services/jdd/jdd-portefeuille.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';

describe('FormulaireModificationComponent', () => {
  let component: FormulaireModificationComponent;
  let fixture: ComponentFixture<FormulaireModificationComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormulaireModificationComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormulaireModificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Given des portefeuilles existants', () => {
    beforeEach(() => {
      spyOn(component.modifie, "emit");
      fixture.componentRef.setInput('portefeuilles', clonePORTEFEUILLES());
      fixture.componentRef.setInput('portefeuille', PORTEFEUILLE);
      fixture.detectChanges(); // appelle le ngOnInit
    });

    it('when #modifierPortefeuille sans nom then il n\'y a pas de modification du portefeuille', () => {
      component.formulaireModificationPortefeuille.get('champNom')?.setValue('');
      component.modifierNomPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledTimes(0);
    });

    it('when #modifierPortefeuille avec un nom en doublon then il n\'y a pas de modification du portefeuille', () => {
      component.formulaireModificationPortefeuille.get('champNom')?.setValue(PORTEFEUILLES[0].nom);
      component.modifierNomPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledTimes(0);
    });

    it('when #modifierPortefeuille avec un nom unique then il y a modification du portefeuille', () => {
      component.formulaireModificationPortefeuille.get('champNom')?.setValue('nomUnique');
      component.modifierNomPortefeuille();
      expect(component.modifie.emit).toHaveBeenCalledWith('nomUnique');
    });
  });
});
