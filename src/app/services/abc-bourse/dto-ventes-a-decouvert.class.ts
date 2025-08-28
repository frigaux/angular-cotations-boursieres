export class DTOVentesADecouvert {
  valeur: string;
  pathname: string;
  pourcentageCapital: number;
  nombreActions: number;
  positionEnM: number;

  constructor(valeur: string, pathname: string, pourcentageCapital: number, nombreActions: number, positionEnM: number) {
    this.valeur = valeur;
    this.pathname = pathname;
    this.pourcentageCapital = pourcentageCapital;
    this.nombreActions = nombreActions;
    this.positionEnM = positionEnM;
  }
}
