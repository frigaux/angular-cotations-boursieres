import {DTOPortefeuille} from '../../services/portefeuilles/dto-portefeuille.interface';
import {CoursPortefeuille} from './cours-portefeuille.class';
import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';
import {AlerteDecoree} from './alerte-decoree.interface';
import {AlertesDecorees} from './alertes-decorees.interface';
import {EtapeValeur} from '../valeurs/achats-valeur/etape-valeur.enum';

export class PortefeuilleAvecCours {
  portefeuille: DTOPortefeuille;
  alertes: AlertesDecorees;
  cours: Array<CoursPortefeuille> = [];
  etapeValeur: EtapeValeur | undefined;

  constructor(portefeuille: DTOPortefeuille, etapeValeur?: EtapeValeur) {
    this.portefeuille = portefeuille;
    const alertesDecorees = portefeuille.alertes.map(this.genererFonctionAlerte);
    const avecOperandeMIN = portefeuille.alertes
      .find(alerte => alerte.condition.includes('MIN(')) !== undefined;
    const avecOperandeMAX = portefeuille.alertes
      .find(alerte => alerte.condition.includes('MAX(')) !== undefined;
    const avecOperandeMOY = portefeuille.alertes
      .find(alerte => alerte.condition.includes('MOY(')) !== undefined;
    const avecOperandeNBV = portefeuille.alertes
      .find(alerte => alerte.condition.includes('NBV(')) !== undefined;
    this.alertes = {alertesDecorees, avecOperandeMIN, avecOperandeMAX, avecOperandeMOY, avecOperandeNBV};
    this.etapeValeur = etapeValeur;
  }

  private genererFonctionAlerte(alerte: DTOAlerte): AlerteDecoree {
    const condition = alerte.condition
      .replaceAll(/C(\d+)/gi, (match, token) => {
        return `cours[${token - 1}].cloture`;
      })
      .replaceAll(/M(\d+)/gi, (match, token) => {
        return `moyennes[${token - 1}]`;
      });
    return {alerte, evaluer: new Function('cours', 'moyennes', 'MIN', 'MAX', 'MOY', 'NBV', `return ${condition};`)};
  }
}
