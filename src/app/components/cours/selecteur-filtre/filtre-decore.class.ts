import {DTOFiltre} from '../../../services/cours/dto-filtre.interface';

export class FiltreDecore {
  id: number;
  filtre: DTOFiltre;
  evaluer: Function;
  avecOperandeMIN: boolean;
  avecOperandeMAX: boolean;
  avecOperandeMOY: boolean;

  constructor(id: number, filtre: DTOFiltre) {
    this.id = id;
    this.filtre = filtre;
    this.evaluer = this.genererFonctionFiltre(filtre);
    this.avecOperandeMIN = filtre.condition.includes('MIN');
    this.avecOperandeMAX = filtre.condition.includes('MAX');
    this.avecOperandeMOY = filtre.condition.includes('MOY');
  }

  private genererFonctionFiltre(filtre: DTOFiltre): Function {
    const condition = filtre.condition
      .replaceAll(/M(\d+)/gi, (match, token) => {
        return `moyennes[${token - 1}]`;
      });
    return new Function('moyennes', 'MIN', 'MAX', 'MOY', `return ${condition};`);
  }
}
