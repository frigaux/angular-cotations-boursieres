export class DTOActualite {
  date: string; // ISO 8601 : yyyy-MM-dd
  titre: string;
  pathname: string;

  constructor(date: string, titre: string, url: string) {
    this.date = date;
    this.titre = titre;
    this.pathname = url;
  }
}
