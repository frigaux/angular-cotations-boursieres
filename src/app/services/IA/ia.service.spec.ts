import {TestBed} from '@angular/core/testing';
import {IAService} from './ia.service';
import * as genai from '@google/genai';
import {REPONSE_API_GEMINI} from '../jdd/jdd-ia.dataset';
import {COURS_CROISSANT} from '../jdd/jdd-cours.dataset';

// Généré par Junie le 19/09/2025
describe('IAService', () => {
  let service: IAService;

  // Simple in-memory mock for localStorage
  const localStore: Record<string, string> = {};

  beforeEach(() => {
    // Reset in-memory storage before each test
    for (const key of Object.keys(localStore)) {
      delete localStore[key];
    }

    TestBed.configureTestingModule({
      providers: [IAService]
    });
    service = TestBed.inject(IAService);

    // Spy on localStorage methods
    spyOn(window.localStorage, 'getItem').and.callFake((key: string): string | null => {
      return Object.prototype.hasOwnProperty.call(localStore, key) ? localStore[key] : null;
    });
    spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string): void => {
      localStore[key] = value;
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#chargerCleAPIGemini', () => {
    it('returns undefined when no key stored', () => {
      expect(service.chargerCleAPIGemini()).toBeUndefined();
    });

    it('returns the stored key when present', () => {
      service.enregistrerCleAPIGemini('ma-cle');
      expect(service.chargerCleAPIGemini()).toBe('ma-cle');
    });
  });

  describe('#interrogerApiGemini', () => {
    it('emits a DTOConseilsGeminiTicker when API resolves successfully', (done) => {
      const mockGenerateContent = jasmine.createSpy('generateContent').and.returnValue(Promise.resolve(REPONSE_API_GEMINI));
      const mockModels = { generateContent: mockGenerateContent } as unknown as genai.Models;
      const mockClient = { models: mockModels } as unknown as genai.GoogleGenAI;
      spyOn<any>(service as any, 'creerClient').and.returnValue(mockClient);

      // Also ensure a key exists so construction uses it
      service.enregistrerCleAPIGemini('cle-test');

      // Act & Assert
      service.interrogerApiGemini(COURS_CROISSANT).subscribe({
        next: dto => {
          expect(dto).toBeDefined();
          // Check a couple of parsed fields
          expect(dto.nom).toBe('Societe Generale');
          expect(dto.acheter).toBeTrue();
        },
        error: err => {
          fail('Expected success, got error: ' + err);
        },
        complete: () => done()
      });
    });

    it('emits error message when API rejects with ApiError containing JSON payload', (done) => {
      const errorPayload = { error: { message: 'Erreur côté API' } };
      const apiError = new genai.ApiError({ message: JSON.stringify(errorPayload), status: 400 });

      const mockGenerateContent = jasmine.createSpy('generateContent').and.returnValue(Promise.reject(apiError));
      const mockModels = { generateContent: mockGenerateContent } as unknown as genai.Models;
      const mockClient = { models: mockModels } as unknown as genai.GoogleGenAI;
      spyOn<any>(service as any, 'creerClient').and.returnValue(mockClient);

      service.enregistrerCleAPIGemini('cle-test');

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
