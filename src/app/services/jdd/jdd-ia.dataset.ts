import {FinishReason, FunctionCall, GenerateContentResponse, MediaModality} from "@google/genai";

export const REPONSE_API_GEMINI: GenerateContentResponse = {
  "codeExecutionResult": undefined,
  "data": undefined,
  "executableCode": undefined,
  "functionCalls": undefined,
  "text": undefined,
  "candidates": [
      {
        "content": {
          "parts": [
            {
              "text": "{\"nom\":\"Societe Generale\",\"marche\":\"Euronext\",\"acheter\":true,\"vendre\":false,\"prixEuros1jour\":25.65,\"prixEuros1semaine\":25.80,\"prixEuros1mois\":26.20,\"prixEuros1an\":28.50,\"analyses\":\"Le consensus des analystes suggère un potentiel de croissance modéré à long terme pour Societe Generale (GLE), malgré les défis du secteur bancaire. Les estimations de prix sont basées sur une amélioration progressive des fondamentaux et une stabilisation de l'environnement économique. Un achat est recommandé pour les investisseurs ayant un horizon de placement supérieur à un an, visant un retour sur investissement modeste mais stable. Les résultats récents montrent une bonne gestion des coûts et une diversification des revenus, ce qui pourrait soutenir le cours de l'action.\"}"
            }
          ],
          "role": "model"
        },
        "finishReason": FinishReason.STOP,
        "index": 0
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 34,
      "candidatesTokenCount": 185,
      "totalTokenCount": 630,
      "promptTokensDetails": [
        {
          "modality": MediaModality.TEXT,
          "tokenCount": 34
        }
      ],
      "thoughtsTokenCount": 411
    },
    "modelVersion": "gemini-2.5-flash",
    "responseId": "PYfNaO7YFZLqkdUPlo2g0Aw"
  }
;
