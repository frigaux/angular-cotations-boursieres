import {DTOPortefeuille} from './gestion-portefeuilles/dto-portefeuille.interface';
import {CoursPortefeuille} from './cours-portefeuille.class';
import {DTOAlerte} from './gestion-portefeuilles/dto-alerte.interface';

export class PortefeuilleAvecCours {
  portefeuille: DTOPortefeuille;
  alertes: { nom: string, evaluer: Function }[];
  cours: Array<CoursPortefeuille> = [];

  constructor(portefeuille: DTOPortefeuille) {
    this.portefeuille = portefeuille;
    this.alertes = portefeuille.alertes.map(this.genererFonctionsAlertes);
  }

  private genererFonctionsAlertes(alerte: DTOAlerte): { nom: string, evaluer: Function } {
    const condition = alerte.condition
      .replaceAll(/C(\d+)/g, (match, token) => {
        return `cours[${token-1}].cloture`;
      })
      .replaceAll(/M(\d+)/g, (match, token) => {
        return `moyennes[${token-1}]`;
      });
    return {nom: alerte.nom, evaluer: new Function('cours', 'moyennes', `return ${condition};`)};
  }
}
