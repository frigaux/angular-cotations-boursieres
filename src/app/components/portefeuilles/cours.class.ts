import {DtoCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';

export class Cours {
  ticker: string;
  libelle: string;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  alerte: boolean;
  coursAlleges: DTOCoursTickerAllege[];
  mm5: number;
  mm20: number;
  mm50: number;
  var1: number;
  var5: number;
  var20: number;
  var50: number;

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
    this.coursAlleges = dto.cours;
    this.mm5 = dto.moyennesMobiles[4];
    this.mm20 = dto.moyennesMobiles[19];
    this.mm50 = dto.moyennesMobiles[49];
    this.var1 = this.calculerVariation(dto, 1);
    this.var5 = this.calculerVariation(dto, 5);
    this.var20 = this.calculerVariation(dto, 20);
    this.var50 = this.calculerVariation(dto, 50);
  }

  private calculerVariation(dto: DtoCoursAvecListeAllege, jours: number) {
    return (dto.cours[0].cloture / dto.cours[jours].cloture) - 1;
  }
}
