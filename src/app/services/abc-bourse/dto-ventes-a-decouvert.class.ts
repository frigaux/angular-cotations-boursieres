export class DTOVentesADecouvert {
  valeur: string;
  pourcentageCapital: number;
  nombreActions: number;
  positionEnM: number;

  constructor(valeur: string, pourcentageCapital: number, nombreActions: number, positionEnM: number) {
    this.valeur = valeur;
    this.pourcentageCapital = pourcentageCapital;
    this.nombreActions = nombreActions;
    this.positionEnM = positionEnM;
  }
}
