import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormulaireCreationComponent} from './formulaire-creation.component';
import {TranslateModule} from '@ngx-translate/core';
import {PORTEFEUILLES} from '../../../../services/jdd/jdd-portefeuilles.dataset';

describe('FormulaireCreationComponent', () => {
  let component: FormulaireCreationComponent;
  let fixture: ComponentFixture<FormulaireCreationComponent>;
  const clonePORTEFEUILLES: Function = () => JSON.parse(JSON.stringify(PORTEFEUILLES))

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormulaireCreationComponent,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormulaireCreationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given des portefeuilles existants', () => {
    beforeEach(() => {
      spyOn(component.cree, "emit");
      fixture.componentRef.setInput('portefeuilles', clonePORTEFEUILLES());
      fixture.detectChanges(); // appelle le ngOnInit
    });

    it('when #creerPortefeuille sans nom then il n\'y a pas de création d\'un nouveau portefeuille', () => {
      component.formulaire.get('nom')?.setValue('');
      component.creerPortefeuille();
      expect(component.cree.emit).toHaveBeenCalledTimes(0);
    });

    it('when #creerPortefeuille avec un nom en doublon then il n\'y a pas de création d\'un nouveau portefeuille', () => {
      component.formulaire.get('nom')?.setValue(PORTEFEUILLES[0].nom);
      component.creerPortefeuille();
      expect(component.cree.emit).toHaveBeenCalledTimes(0);
    });

    it('when #creerPortefeuille avec un nom unique then il y a création d\'un nouveau portefeuille', () => {
      component.formulaire.get('nom')?.setValue('nomUnique');
      component.creerPortefeuille();
      expect(component.cree.emit).toHaveBeenCalledWith({nom: 'nomUnique', initialiserAlertes: true});
    });
  });
});
