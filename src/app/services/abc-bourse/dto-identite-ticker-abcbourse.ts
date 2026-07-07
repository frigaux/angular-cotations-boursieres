export class DTOIdentiteTickerAbcbourse {
  aPropos: string;
  marche: string;
  place: string;
  secteur: string;
  indices: string;
  nombreTitres: number;
  adresse: string;
  telephone: string;
  dateAssemblee?: string; // ISO 8601 : yyyy-MM-dd


  constructor(aPropos: string, marche: string, place: string, secteur: string, indices: string, nombreTitres: number, adresse: string, telephone: string, dateAssemblee?: string) {
    this.aPropos = aPropos;
    this.marche = marche;
    this.place = place;
    this.secteur = secteur;
    this.indices = indices;
    this.nombreTitres = nombreTitres;
    this.adresse = adresse;
    this.telephone = telephone;
    this.dateAssemblee = dateAssemblee;
  }
}
