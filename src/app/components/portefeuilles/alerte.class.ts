export class Alerte {
  nom: string;
  evaluation: boolean;

  constructor(private nom_: string, private evaluation_: boolean) {
    this.nom = nom_;
    this.evaluation = evaluation_;
  }
}
