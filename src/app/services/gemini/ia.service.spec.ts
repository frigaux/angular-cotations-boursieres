import {TestBed} from '@angular/core/testing';
import {IAService} from './ia.service';
import * as genai from '@google/genai';
import {REPONSE_API_GEMINI} from '../jdd/jdd-ia.dataset';
import {COURS_CROISSANT} from '../jdd/jdd-cours.dataset';

// Généré par Junie le 19/09/2025
describe('IAService', () => {
  let service: IAService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IAService]
    });
    service = TestBed.inject(IAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Given le localStorage mocké', () => {
    let mockLocalStorage: Record<string, string>;

    beforeEach(() => {
      mockLocalStorage = {};
      spyOn(window.localStorage, 'getItem').and.callFake(
        (key: string) => mockLocalStorage[key] || null
      );
      spyOn(window.localStorage, 'setItem').and.callFake(
        (key: string, value: string) => mockLocalStorage[key] = value
      );
    });

    it('when #chargerCleAPIGemini then undefined', () => {
      expect(service.chargerCleAPIGemini()).toBeUndefined();
    });

    it('when #enregistrerCleAPIGemini then #chargerCleAPIGemini renvoie la valeur enregistrée', () => {
      service.enregistrerCleAPIGemini('ma-cle');
      expect(service.chargerCleAPIGemini()).toBe('ma-cle');
    });
  });

  describe('Given le localStorage mocké', () => {
    const mockCreerClient: Function = (value: any) => {
      const mockGenerateContent = jasmine.createSpy('generateContent').and.returnValue(value);
      const mockModels = {generateContent: mockGenerateContent} as unknown as genai.Models;
      const mockClient = {models: mockModels} as unknown as genai.GoogleGenAI;
      spyOn(service as any, 'creerClient').and.returnValue(mockClient);
    };

    beforeEach(() => {
      spyOn(window.localStorage, 'getItem').and.returnValue('cle-test')
    });

    it('when #creerClient est mocké avec une réponse valide et #interrogerApiGemini then on récupère les informations', (done) => {
      mockCreerClient(Promise.resolve(REPONSE_API_GEMINI));

      service.interrogerApiGemini(COURS_CROISSANT).subscribe({
        next: dto => {
          expect(dto).toBeDefined();
          expect(dto.nom).toBe(COURS_CROISSANT.libelle);
          expect(dto.acheter).toBeTrue();
        },
        error: err => {
          fail('Expected success, got error: ' + err);
        },
        complete: () => done()
      });
    });

    it('when #creerClient est mocké avec une réponse invalide et #interrogerApiGemini then on récupère l\'erreur', (done) => {
      const errorPayload = {error: {message: 'Erreur côté API'}};
      const apiError = new genai.ApiError({message: JSON.stringify(errorPayload), status: 400});
      mockCreerClient(Promise.reject(apiError));

      service.interrogerApiGemini(COURS_CROISSANT).subscribe({
        next: () => fail('Expected an error'),
        error: err => {
          expect(err).toBe('Erreur côté API');
          done();
        }
      });
    });
  });
});
