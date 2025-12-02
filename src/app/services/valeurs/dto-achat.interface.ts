export interface DTOAchat {
  quantite: number;
  prix: number;
  date?: string; // ISO 8601 : yyyy-MM-dd
  prixRevente?: number;
  dateRevente?: string; // ISO 8601 : yyyy-MM-dd
}
