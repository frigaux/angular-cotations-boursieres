export interface DTOCoursTicker {
  date: string; // ISO 8601 : yyyy-MM-dd
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
}
