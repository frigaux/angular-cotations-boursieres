import {DtoCoursAvecListeAllege} from '../../services/cours/dto-cours-avec-liste-allege.interface';
import {DTOCoursTickerAllege} from '../../services/cours/dto-cours-ticker-allege.interface';
import {Alerte} from './alerte.class';
import {DTOAlerte} from '../../services/portefeuilles/dto-alerte.interface';
import {DTOValeur} from '../../services/valeurs/dto-valeur.interface';
import {Marches} from '../../services/valeurs/marches.enum';

export class CoursPortefeuille {
  date: Date;
  ticker: string;
  libelle: string;
  marche: Marches;
  ouverture: number;
  plusHaut: number;
  plusBas: number;
  cloture: number;
  volume: number;
  moyennesMobiles: number[];
  alerte: boolean;
  coursAlleges: DTOCoursTickerAllege[];
  // TODO : remove !
  mm5: number | undefined;
  mm20: number | undefined;
  mm50: number | undefined;
  var1: number | undefined;
  var5: number | undefined;
  var20: number | undefined;
  var50: number | undefined;
  alertes: Alerte[];

  constructor(valeur: DTOValeur, dto: DtoCoursAvecListeAllege,
              alertes: { alerte: DTOAlerte, evaluer: Function }[]) {
    this.date = dto.cours[0].date;
    this.ticker = dto.ticker;
    this.libelle = valeur.libelle;
    this.marche = valeur.marche;
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
    this.alertes = this.evaluerAlertes(alertes);
  }

  // TODO : remove !
  private calculerVariation(dto: DtoCoursAvecListeAllege, jours: number) {
    if (dto.cours.length > jours) {
      return (dto.cours[0].cloture / dto.cours[jours].cloture) - 1;
    } else {
      return undefined;
    }
  }

  // TODO : renommmer !
  public calculerVariation2(jours: number) {
    if (this.coursAlleges.length > jours) {
      return (this.coursAlleges[0].cloture / this.coursAlleges[jours].cloture) - 1;
    } else {
      return undefined;
    }
  }

  private evaluerAlertes(alertes: { alerte: DTOAlerte, evaluer: Function }[]): Alerte[] {
    return alertes.map(dto =>
      new Alerte(dto.alerte, dto.evaluer(this.coursAlleges, this.moyennesMobiles))
    );
  }
}
