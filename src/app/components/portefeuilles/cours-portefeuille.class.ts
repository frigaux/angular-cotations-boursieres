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
    this.alertes = this.evaluerAlertes(alertes);
    Object.assign(this, { var1: this.calculerVariation(1) });
    Object.assign(this, { var5: this.calculerVariation(5) });
  }

  public calculerVariation(jours: number) {
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
