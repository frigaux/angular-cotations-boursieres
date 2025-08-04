import {DTOFiltre} from '../../../services/cours/dto-filtre.interface';

export class FiltreDecore {
  id: number;
  filtre: DTOFiltre;
  evaluer: Function;

  constructor(id: number, filtre: DTOFiltre) {
    this.id = id;
    this.filtre = filtre;
    this.evaluer = this.genererFonctionFiltre(filtre);
  }

  private genererFonctionFiltre(filtre: DTOFiltre): Function {
    const condition = filtre.condition
      .replaceAll(/M(\d+)/g, (match, token) => {
        return `moyennes[${token - 1}]`;
      });
    return new Function('moyennes', `return ${condition};`);
  }
}
