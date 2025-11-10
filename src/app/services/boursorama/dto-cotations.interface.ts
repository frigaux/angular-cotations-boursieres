export interface DTOCotations {
  cours: number;
  ouverture: number;
  clotureVeille: number;
  plusHaut: number;
  plusBas: number;
  volume: number;

  pourcentageCapitalEchange: number;
  valorisation: string;
  limiteBaisse: number;
  limiteHausse: number;
  pourcentageRendementEstime: number;
  perEstime: number;
  dernierDividende: number;
  dateDernierDividende: string; // ISO 8601 : yyyy-MM-dd
  risqueESG: string;
}
