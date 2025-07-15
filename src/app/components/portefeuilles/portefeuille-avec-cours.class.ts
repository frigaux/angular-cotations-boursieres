import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';
import {CoursPortefeuille} from './cours-portefeuille.class';
import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';

export class PortefeuilleAvecCours {
  portefeuille: DTOPortefeuille;
  alertes: { alerte: DTOAlerte, evaluer: Function }[];
  cours: Array<CoursPortefeuille> = [];

  constructor(portefeuille: DTOPortefeuille) {
    this.portefeuille = portefeuille;
    this.alertes = portefeuille.alertes.map(this.genererFonctionsAlertes);
  }

  private genererFonctionsAlertes(alerte: DTOAlerte): { alerte: DTOAlerte, evaluer: Function } {
    const condition = alerte.condition
      .replaceAll(/C(\d+)/g, (match, token) => {
        return `cours[${token-1}].cloture`;
      })
      .replaceAll(/M(\d+)/g, (match, token) => {
        return `moyennes[${token-1}]`;
      });
    return {alerte, evaluer: new Function('cours', 'moyennes', `return ${condition};`)};
  }
}
