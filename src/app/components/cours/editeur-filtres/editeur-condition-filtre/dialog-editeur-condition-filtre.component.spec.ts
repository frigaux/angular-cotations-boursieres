import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogEditeurConditionFiltreComponent} from './dialog-editeur-condition-filtre.component';
import {TranslateModule} from '@ngx-translate/core';
import {FILTRES} from '../../../../services/jdd/jdd-cours.dataset';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('DialogEditeurConditionFiltreComponent', () => {
  let component: DialogEditeurConditionFiltreComponent;
  let fixture: ComponentFixture<DialogEditeurConditionFiltreComponent>;

  const cloneFILTRES: Function = () => JSON.parse(JSON.stringify(FILTRES));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DialogEditeurConditionFiltreComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        provideAnimations(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DialogEditeurConditionFiltreComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given un filtre en input', () => {
    beforeEach(() => {
      spyOn(component.modifie, "emit");
      fixture.componentRef.setInput('filtre', cloneFILTRES()[0]);
    });

    it('when #intercepteurFiltre then le filtre passe en édition', () => {
      fixture.detectChanges();
      expect(component).toBeDefined();
      expect(component.filtre).toEqual(FILTRES[0]);
      expect(component.formulaire.get('condition')!.value).toEqual(FILTRES[0].condition);
    });

    it('when #modifierConditionFiltre avec une condition invalide then il n\'y a pas modification de la condition du filtre', () => {
      fixture.detectChanges();
      const conditionInvalide = ' x1 <> x2';
      component.formulaire.get('condition')?.setValue(conditionInvalide);
      component.modifierConditionFiltre();
      expect(component.modifie.emit).toHaveBeenCalledTimes(0);
    });

    it('when #modifierConditionFiltre avec une condition valide then il y a modification de la condition du filtre', () => {
      fixture.detectChanges();
      const conditionValide = 'M1 < M5';
      component.formulaire.get('condition')?.setValue(conditionValide);
      component.modifierConditionFiltre();
      expect(component.modifie.emit).toHaveBeenCalledWith(conditionValide);
    });
  });
});
