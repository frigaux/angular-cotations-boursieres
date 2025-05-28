import {DTOCours} from '../../services/cours/dto-cours.interface';
import {DTOCoursTicker} from '../../services/cours/dto-cours-ticker.interface';

export class Cours {
  date: Date;
  ticker!: string;
  libelle!: string;
  ouverture!: number;
  plusHaut!: number;
  plusBas!: number;
  cloture!: number;
  volume!: number;
  moyennesMobiles!: number[];
  alerte!: boolean;

  constructor(private date_: Date, private ticker_: string, private libelle_: string, private dto: DTOCours | DTOCoursTicker) {
    this.date = date_;
    this.ticker = ticker_;
    this.libelle = libelle_;
    this.ouverture = dto.ouverture;
    this.plusHaut = dto.plusHaut;
    this.plusBas = dto.plusBas;
    this.cloture = dto.cloture;
    this.volume = dto.volume;
    this.moyennesMobiles = dto.moyennesMobiles;
    this.alerte = dto.alerte;
  }
}
