import {DTOCours} from '../../services/cours/DTOCours';
import {DTOValeur} from '../../services/valeurs/DTOValeur';

export class Cours {
  ticker!: string;
  libelle!: string;
  ouverture!: number;
  plusHaut!: number;
  plusBas!: number;
  cloture!: number;
  volume!: number;
  moyennesMobiles!: number[];
  alerte!: boolean;

  constructor(private dto: DTOCours, private valeurByTicker : Map<string, DTOValeur>) {
    this.ticker = dto.ticker;
    this.libelle = valeurByTicker.get(dto.ticker)!.libelle;
    this.ouverture = dto.ouverture;
    this.plusHaut = dto.plusHaut;
    this.plusBas = dto.plusBas;
    this.cloture = dto.cloture;
    this.volume = dto.volume;
    this.moyennesMobiles = dto.moyennesMobiles;
    this.alerte = dto.alerte;
  }
}
