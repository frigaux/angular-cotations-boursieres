import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormulaireUrlSauvegardeRestaurationComponent} from './formulaire-url-sauvegarde-restauration.component';
import {TranslateModule} from '@ngx-translate/core';
import {ParametrageService} from '../../../../services/parametrage/parametrage.service';

describe('FormulaireCleApiGeminiComponent', () => {
  let component: FormulaireUrlSauvegardeRestaurationComponent;
  let fixture: ComponentFixture<FormulaireUrlSauvegardeRestaurationComponent>;

  const mockParametrageService = jasmine.createSpyObj('ParametrageService', ['chargerUrlSauvegardeRestauration', 'enregistrerUrlSauvegardeRestauration']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormulaireUrlSauvegardeRestaurationComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: ParametrageService, useValue: mockParametrageService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormulaireUrlSauvegardeRestaurationComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerUrlSauvegardeRestauration renvoie undefined', () => {
    beforeEach(() => {
      mockParametrageService.chargerUrlSauvegardeRestauration.and.returnValue(undefined);
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      expect(component.creationUrlSauvegardeRestauration).toBeTrue();
      expect(component.modificationUrlSauvegardeRestauration).toBeFalse();
    });
  })

  describe('Given #chargerUrlSauvegardeRestauration renvoie une clé', () => {
    beforeEach(() => {
      mockParametrageService.chargerUrlSauvegardeRestauration.and.returnValue('cle-test');
      spyOn(component.modifie, "emit");
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      expect(component.creationUrlSauvegardeRestauration).toBeFalse();
      expect(component.modificationUrlSauvegardeRestauration).toBeTrue();
      component.enregistrerUrlSauvegardeRestauration();
      expect(component.modifie.emit).toHaveBeenCalled();
      expect(mockParametrageService.enregistrerUrlSauvegardeRestauration).toHaveBeenCalledWith('cle-test');
    });
  })
});
