export class DTOIndicateur {
  annee: number;
  bnpa: number;
  per: number;

  constructor(annee: number, bnpa: number, per: number) {
    this.annee = annee;
    this.bnpa = bnpa;
    this.per = per;
  }
}
