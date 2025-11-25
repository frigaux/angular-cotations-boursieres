export interface DTOAchat {
  date: string; // ISO 8601 : yyyy-MM-dd
  quantite: number;
  prix: number;
  dateRevente?: string; // ISO 8601 : yyyy-MM-dd
  prixRevente?: number;
}
