import {DtoCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';

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

  constructor(private libelle_: string, private dto: DtoCoursAvecListeAllege) {
    this.ticker = dto.ticker;
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
