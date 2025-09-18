export class DTOConseilsGeminiTicker {
  nom?: string;
  marche?: string;
  acheter?: boolean;
  vendre?: boolean;
  prixEuros1jour?: number;
  prixEuros1semaine?: number;
  prixEuros1mois?: number;
  prixEuros1an?: number;
  analyses?: string;

  constructor(text: string) {
    const json = JSON.parse(text);
    this.nom = json.nom;
    this.marche = json.marche;
    this.acheter = json.acheter;
    this.vendre = json.vendre;
    this.prixEuros1jour = json.prixEuros1jour;
    this.prixEuros1semaine = json.prixEuros1semaine;
    this.prixEuros1mois = json.prixEuros1mois;
    this.prixEuros1an = json.prixEuros1an;
    this.analyses = json.analyses;
  }
}
