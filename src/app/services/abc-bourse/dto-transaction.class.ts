export class DTOTransaction {
  valeur: string;
  dateDeclaration: string; // ISO 8601 : yyyy-MM-dd
  operation: string;
  instrument: string;
  montant: number;
  auteur: string;
  dateOperation: string; // ISO 8601 : yyyy-MM-dd
  quantite: number;
  prix: number;

  constructor(valeur: string, dateDeclaration: string, operation: string, instrument: string, montant: number, auteur: string, dateOperation: string, quantite: number, prix: number) {
    this.valeur = valeur;
    this.dateDeclaration = dateDeclaration;
    this.operation = operation;
    this.instrument = instrument;
    this.montant = montant;
    this.auteur = auteur;
    this.dateOperation = dateOperation;
    this.quantite = quantite;
    this.prix = prix;
  }
}
