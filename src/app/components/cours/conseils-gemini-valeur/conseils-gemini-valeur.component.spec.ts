import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ConseilsGeminiValeurComponent} from './conseils-gemini-valeur.component';
import {IAService} from '../../../services/IA/ia.service';
import {of} from 'rxjs';
import {DTOConseilsGeminiTicker} from '../../../services/IA/dto-conseils-gemini-ticker.class';
import {REPONSE_API_GEMINI} from '../../../services/jdd/jdd-ia.dataset';
import {COURS_CROISSANT} from '../../../services/jdd/jdd-cours.dataset';
import {TranslateModule} from '@ngx-translate/core';

describe('ConseilsGeminiValeurComponent', () => {
  let component: ConseilsGeminiValeurComponent;
  let fixture: ComponentFixture<ConseilsGeminiValeurComponent>;

  const mockIAService = jasmine.createSpyObj('IAService', ['chargerCleAPIGemini', 'interrogerApiGemini']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConseilsGeminiValeurComponent,
        TranslateModule.forRoot({})
      ],
      providers: [
        {provide: IAService, useValue: mockIAService}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConseilsGeminiValeurComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Given #chargerCleAPIGemini renvoie une clé et #interrogerApiGemini renvoie un DTO', () => {
    beforeEach(() => {
      mockIAService.chargerCleAPIGemini.and.returnValue('cle-test');
      mockIAService.interrogerApiGemini.and.returnValue(of(new DTOConseilsGeminiTicker(REPONSE_API_GEMINI.candidates![0].content!.parts![0].text!)));
    });

    it('when on fournit un cours en input then le DTO est bien chargé', () => {
      fixture.componentRef.setInput('cours', COURS_CROISSANT);
      component.interrogerApiGemini();
      fixture.detectChanges();
      expect(component.conseilsGeminiTicker).toBeDefined();
    });
  });
});
