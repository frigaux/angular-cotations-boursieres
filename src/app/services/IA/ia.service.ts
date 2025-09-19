import {Injectable} from '@angular/core';
import {ApiError, GenerateContentConfig, GoogleGenAI, Type} from '@google/genai';
import {Cours} from '../../components/cours/cours.class';
import {DTOConseilsGeminiTicker} from './dto-conseils-gemini-ticker.class';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IAService {
  private static readonly CLE_API_GEMINI = 'CLE_API_GEMINI';
  private static readonly GENERATECONTENTCONFIG: GenerateContentConfig = {
    // safetySettings: [
    //   {
    //     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //     threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    //   },
    // ],
    // temperature: 0.9,
    // topP: 1,
    // topK: 32,
    // maxOutputTokens: 100,
    responseMimeType: 'application/json',
    responseSchema: { // OpenAPI-like Schema subset expected by @google/genai
      type: Type.OBJECT,
      description: 'Recommandations sur l\'achat d\'une action sur les marchés EURONEXT.',
      properties: {
        nom: {
          type: Type.STRING,
          description: 'Nom de l\'action.'
        },
        marche: {
          type: Type.STRING,
          description: 'Marché de l\'action.'
        },
        acheter: {
          type: Type.BOOLEAN,
          description: 'Acheter ou pas l\'action ?.'
        },
        vendre: {
          type: Type.BOOLEAN,
          description: 'Vendre ou pas l\'action ?.'
        },
        prixEuros1jour: {
          type: Type.NUMBER,
          description: 'Prix en euros de l\'action dans 1 jour.'
        },
        prixEuros1semaine: {
          type: Type.NUMBER,
          description: 'Prix en euros de l\'action dans 1 semaine.'
        },
        prixEuros1mois: {
          type: Type.NUMBER,
          description: 'Prix en euros de l\'action dans 1 mois.'
        },
        prixEuros1an: {
          type: Type.NUMBER,
          description: 'Prix en euros de l\'action dans 1 année.'
        },
        analyses: {
          type: Type.STRING,
          description: 'Evaluation, consensus et analyses concernant l\'action.'
        }
      },
      required: ['nom', 'marche', 'acheter', 'vendre', 'prixEuros1jour', 'prixEuros1semaine', 'prixEuros1mois', 'prixEuros1an', 'analyses'],
      propertyOrdering: ['nom', 'marche', 'acheter', 'vendre', 'prixEuros1jour', 'prixEuros1semaine', 'prixEuros1mois', 'prixEuros1an', 'analyses']
    }
  };

  public chargerCleAPIGemini(): string | undefined {
    return window.localStorage.getItem(IAService.CLE_API_GEMINI) || undefined;
  }

  public enregistrerCleAPIGemini(cleAPIGemini: string): void {
    window.localStorage.setItem(IAService.CLE_API_GEMINI, cleAPIGemini);
  }

  public interrogerApiGemini(cours: Cours): Observable<DTOConseilsGeminiTicker> {
    return new Observable(observer => {
      new GoogleGenAI(
        {
          apiKey: this.chargerCleAPIGemini()
        }
      ).models.generateContent(
        {
          model: "gemini-2.5-flash",
          contents: `Ecrire une recommandation d'achat ou vente concernant l\'action "${cours.libelle}" identifiée par le ticker "${cours.ticker}" sur le marché Euronext`,
          config: IAService.GENERATECONTENTCONFIG
        }
      ).then(reponse => {
          if (reponse && reponse.candidates && reponse.candidates.length > 0) {
            const candidate = reponse.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
              const part = candidate.content.parts[0];
              if (part.text) {
                observer.next(new DTOConseilsGeminiTicker(part.text));
              }
            }
          }
          observer.complete();
        }
      ).catch(erreur => {
        if (erreur instanceof ApiError) {
          const json = JSON.parse(erreur.message);
          if ('error' in json) {
            const error = json.error;
            if ('message' in error) {
              observer.error(error.message);
            }
          }
        }
        observer.complete();
      });
    });
  }
}
