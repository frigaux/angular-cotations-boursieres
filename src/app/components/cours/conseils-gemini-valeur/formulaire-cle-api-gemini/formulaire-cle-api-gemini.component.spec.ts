import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FormulaireCleApiGeminiComponent} from './formulaire-cle-api-gemini.component';
import {IAService} from '../../../../services/IA/ia.service';
import {TranslateModule} from '@ngx-translate/core';

describe('FormulaireCleApiGeminiComponent', () => {
  let component: FormulaireCleApiGeminiComponent;
  let fixture: ComponentFixture<FormulaireCleApiGeminiComponent>;

  const mockIAService = jasmine.createSpyObj('IAService', ['chargerCleAPIGemini', 'enregistrerCleAPIGemini']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormulaireCleApiGeminiComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: IAService, useValue: mockIAService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormulaireCleApiGeminiComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerCleAPIGemini renvoie undefined', () => {
    beforeEach(() => {
      mockIAService.chargerCleAPIGemini.and.returnValue(undefined);
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      expect(component.creationCleApiGemini).toBeTrue();
      expect(component.modificationCleApiGemini).toBeFalse();
    });
  })

  describe('Given #chargerCleAPIGemini renvoie une clé', () => {
    beforeEach(() => {
      mockIAService.chargerCleAPIGemini.and.returnValue('cle-test');
      spyOn(component.modifie, "emit");
    });

    it('when #ngOnInit then le composant est chargé', () => {
      fixture.componentRef.setInput('visible', true);
      fixture.detectChanges();
      expect(component.creationCleApiGemini).toBeFalse();
      expect(component.modificationCleApiGemini).toBeTrue();
      component.enregistrerCleApiGemini();
      expect(component.modifie.emit).toHaveBeenCalled();
      expect(mockIAService.enregistrerCleAPIGemini).toHaveBeenCalledWith('cle-test');
    });
  })
});
