import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';

export class Valeur {
  ticker!: string;
  marche!: string;
  libelle!: string;

  constructor(private dto: DTOValeur, private libelleMarche: string) {
    this.ticker = dto.ticker;
    this.marche = libelleMarche;
    this.libelle = dto.libelle;
  }
}
